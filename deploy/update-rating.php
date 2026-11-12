<?php
/**
 * Ежедневное обновление рейтинга «Фабрики» из Яндекс Карт.
 * PHP-версия scripts/fetch-yandex-rating.mjs для обычного хостинга (Beget, Timeweb и т.п.).
 *
 * Запуск (из планировщика cron в панели хостинга):
 *   php /путь/к/update-rating.php /путь/к/сайту/rating.json
 *
 * ВАЖНО: кладите этот файл ВНЕ папки сайта (не в public_html), чтобы его
 * нельзя было дёрнуть из браузера.
 *
 * Если Яндекс не ответил, показал капчу или поменял разметку — старый rating.json
 * остаётся как есть, на сайте продолжают показываться последние полученные цифры.
 */

const ORG_ID = '178860656686'; // то же, что CONFIG.yandexOrgId в src/config.js
const TIMEOUT = 20;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit;
}

function logMsg(string $msg): void
{
    fwrite(STDOUT, '[' . date('Y-m-d H:i:s') . '] [rating] ' . $msg . PHP_EOL);
}

function fetchPage(string $url): string
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 5,
            CURLOPT_TIMEOUT => TIMEOUT,
            CURLOPT_USERAGENT => USER_AGENT,
            CURLOPT_HTTPHEADER => ['Accept-Language: ru-RU,ru;q=0.9'],
            CURLOPT_ENCODING => '',
        ]);
        $html = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        $err = curl_error($ch);
        if ($html === false) throw new RuntimeException("сеть: $err");
        if ($code !== 200) throw new RuntimeException("HTTP $code");
        return $html;
    }

    $ctx = stream_context_create(['http' => [
        'timeout' => TIMEOUT,
        'header' => "User-Agent: " . USER_AGENT . "\r\nAccept-Language: ru-RU,ru;q=0.9\r\n",
        'follow_location' => 1,
    ]]);
    $html = @file_get_contents($url, false, $ctx);
    if ($html === false) throw new RuntimeException('не удалось загрузить страницу');
    return $html;
}

function parseRating(string $html): array
{
    $start = stripos($html, 'itemprop="aggregateRating"');
    if ($start === false) throw new RuntimeException('блок aggregateRating не найден (капча или изменилась разметка)');
    $block = substr($html, $start, 800);

    $meta = function (string $name) use ($block): ?string {
        return preg_match('/itemprop="' . $name . '"\s+content="([^"]+)"/i', $block, $m) ? $m[1] : null;
    };

    $ratingValue = (float) $meta('ratingValue');
    $ratingCount = (int) $meta('ratingCount');
    $reviewCount = $meta('reviewCount');
    $bestRating = (float) ($meta('bestRating') ?: 5);

    if ($ratingValue < 1 || $ratingValue > $bestRating) throw new RuntimeException('странный рейтинг: ' . $meta('ratingValue'));
    if ($ratingCount <= 0) throw new RuntimeException('странное число оценок: ' . $meta('ratingCount'));

    return [
        'ratingValue' => $ratingValue,
        'ratingCount' => $ratingCount,
        'reviewCount' => $reviewCount === null ? null : (int) $reviewCount,
        'bestRating' => $bestRating,
        'url' => 'https://yandex.ru/maps/org/' . ORG_ID . '/reviews/',
        'updatedAt' => gmdate('Y-m-d\TH:i:s\Z'),
    ];
}

$out = $argv[1] ?? null;
if (!$out) {
    logMsg('укажите путь к rating.json: php update-rating.php /путь/к/сайту/rating.json');
    exit(1);
}
if (!is_dir(dirname($out))) {
    logMsg('папка не найдена: ' . dirname($out));
    exit(1);
}

try {
    $data = parseRating(fetchPage('https://yandex.ru/maps/org/' . ORG_ID . '/'));
} catch (Throwable $e) {
    logMsg($e->getMessage() . '. Оставляю прежние данные.');
    exit(0);
}

$prev = is_file($out) ? json_decode((string) file_get_contents($out), true) : null;

// Пишем во временный файл и переименовываем, чтобы посетитель не получил полузаписанный JSON
$tmp = $out . '.tmp';
$json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
if (file_put_contents($tmp, $json) === false || !rename($tmp, $out)) {
    @unlink($tmp);
    logMsg('не удалось записать ' . $out . ' (проверьте права на папку)');
    exit(1);
}

$was = $prev ? sprintf(' (было %s, %s оценок)', $prev['ratingValue'] ?? '?', $prev['ratingCount'] ?? '?') : '';
logMsg(sprintf('%s ★, %d оценок, %s отзывов%s → %s', $data['ratingValue'], $data['ratingCount'], $data['reviewCount'] ?? '?', $was, $out));
