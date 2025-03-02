<?php
session_start();

$pdo = new PDO('sqlite:servers.db');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Обновлённая таблица servers с полями для хранения IP и времени добавления
$pdo->exec("CREATE TABLE IF NOT EXISTS servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    ip TEXT,
    version TEXT,
    language TEXT,
    votes INTEGER DEFAULT 0,
    vip INTEGER DEFAULT 0,
    submit_ip TEXT,
    added_at INTEGER
)");

$pdo->exec("CREATE TABLE IF NOT EXISTS votes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT,
    server_id INTEGER,
    timestamp INTEGER
)");

// Функция для получения истинного IP пользователя
function getUserIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        // Может быть несколько IP, берём первый
        $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        return trim($ips[0]);
    }
    return $_SERVER['REMOTE_ADDR'];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['add_server'])) {
        $user_ip = getUserIP();
        // Проверяем, добавлял ли уже пользователь сервер в последние 1 час (3600 секунд)
        $stmt = $pdo->prepare("SELECT added_at FROM servers WHERE submit_ip = ? ORDER BY added_at DESC LIMIT 1");
        $stmt->execute([$user_ip]);
        $last_added = $stmt->fetchColumn();
        if ($last_added && (time() - $last_added < 86400)) {
            // Если сервер уже добавлялся менее чем 24 часов назад, перенаправляем с сообщением об ошибке
            header('Location: /?error=server_already_added');
            exit;
        }
        $stmt = $pdo->prepare("INSERT INTO servers (name, ip, version, language, vip, submit_ip, added_at) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $_POST['name'],
            $_POST['ip'],
            $_POST['version'],
            $_POST['language'],
            $_POST['vip'] ?? 0,
            $user_ip,
            time()
        ]);
        header('Location: /#footer');
        exit;
    }

    if (isset($_POST['vote'])) {
        $server_id = (int)$_POST['server_id'];
        $ip = getUserIP();  // Получаем настоящий IP пользователя
        $stmt = $pdo->prepare("SELECT timestamp FROM votes WHERE ip = ? AND server_id = ? ORDER BY timestamp DESC LIMIT 1");
        $stmt->execute([$ip, $server_id]);
        $last_vote = $stmt->fetchColumn();
        
        // Задержка 3600 секунд между голосами для одного IP
        if (!$last_vote || time() - $last_vote >= 3600) {
            $pdo->prepare("INSERT INTO votes (ip, server_id, timestamp) VALUES (?, ?, ?)")
                ->execute([$ip, $server_id, time()]);
            $pdo->prepare("UPDATE servers SET votes = votes + 1 WHERE id = ?")
                ->execute([$server_id]);
        }
        
        header('Location: /?error=vote_already');
        exit;
    }
}

$servers = $pdo->query("SELECT * FROM servers ORDER BY vip DESC, votes DESC")->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PixelPing - Мониторинг Minecraft серверов</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <header>
        <h1><a href="/">PixelPing</a></h1>
    </header>
    <div class="container">
        <div class="description-block">
            <h2>Мониторинг серверов Minecraft: лучшие проекты и IP</h2>
            <p>Откройте новый уровень в мире Minecraft с нашим мониторингом серверов! Привлекайте игроков и следите за динамикой вашего проекта. Растите и развивайтесь быстрее! Или найдите сервер своей мечты, где каждый блок будет в твоем распоряжении. Стройтесь и создавайте уникальные миры</p>
        </div>
		
		<?php
    if (isset($_GET['error']) && $_GET['error'] === 'server_already_added') {
        echo '<p style="color: red; font-family: \'Press Start 2P\', cursive;">Вы уже добавляли сервер в последние 24 часа!</p>';
    }
    ?>
		
    <?php
    if (isset($_GET['error']) && $_GET['error'] === 'vote_already') {
        echo '<p style="color: red; font-family: \'Press Start 2P\', cursive;">Вы уже голосвали за этот сервер. Можно голосовать один раз в час!</p>';
    }
    ?>

        <div class="vip-servers">
            <h2>VIP Сервера</h2>
            <?php foreach ($servers as $server): ?>
                <?php if ($server['vip']): ?>
                    <div class="vip-server-item">
                        <h3><?= htmlspecialchars($server['name']) ?></h3>
                        <h3><?= htmlspecialchars($server['ip']) ?></h3>
                        <p>Версия: <?= htmlspecialchars($server['version']) ?></p>

                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
            <a href="https://t.me/+F-Z5IkvlzZU1MzJi">
                <button class="vip-button">Хочу в VIP!</button>
            </a>
        </div>
        <div class="block">
            <h3>Добавить сервер</h3>
            <form method="POST">
                <input type="text" name="name" placeholder="Название сервера" required maxlength="30">
                <input type="text" name="ip" placeholder="IP адрес сервера" required maxlength="20">
                <select name="version">
                    <option value="">Выберите версию</option>
                    <option>1.0</option>
                    <option>1.1</option>
                    <option>1.2</option>
                    <option>1.3</option>
                    <option>1.4</option>
                    <option>1.5</option>
                    <option>1.6</option>
                    <option>1.7</option>
                    <option>1.8</option>
                    <option>1.9</option>
                    <option>1.10</option>
                    <option>1.11</option>
                    <option>1.12</option>
                    <option>1.13</option>
                    <option>1.14</option>
                    <option>1.15</option>
                    <option>1.16</option>
                    <option>1.17</option>
                    <option>1.18</option>
                    <option>1.19</option>
                    <option>1.20</option>
                    <option>1.21</option>
                </select>


                <input type="submit" name="add_server" value="Добавить">
            </form>
        </div>
        <div class="server-list">
            <?php foreach ($servers as $server): ?>
                <?php if (!$server['vip']): ?>
                    <div class="server-item">
                        <h3><?= htmlspecialchars($server['name']) ?></h3>
                        <h3><?= htmlspecialchars($server['ip']) ?></h3>
                        <p>v:<?= htmlspecialchars($server['version']) ?></p>

                        <div class="vote-container">
                            <form method="POST">
                                <input type="hidden" name="server_id" value="<?= $server['id'] ?>">
                                <button type="submit" name="vote" class="vote-button"><span>❤️</span> Голосовать (<?= $server['votes'] ?>)</button>
                            </form>
                        </div>
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
    </div>
    <footer id="footer">
        <p>&copy; 2025 PixelPing</p>
        <p>&copy; PixelPing не имеет отношения к Mojang. Вся информация принадлежит PixelPing</p>
    </footer>
</body>

</html>