<?php
session_start();

$pdo = new PDO('sqlite:servers.db');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Удаление сервера
    if (isset($_POST["delete_id"])) {
        $id = (int)$_POST["delete_id"];
        $stmt = $pdo->prepare("DELETE FROM servers WHERE id = ?");
        $stmt->execute([$id]);
        header("Location: edit1337.php");
        exit;
    }
    // Обновление данных сервера
    if (isset($_POST["update_id"])) {
        $id = (int)$_POST["update_id"];
        $stmt = $pdo->prepare("UPDATE servers SET name = ?, ip = ?, version = ?, language = ?, votes = ?, vip = ? WHERE id = ?");
        $stmt->execute([
            $_POST["name"],
            $_POST["ip"],
            $_POST["version"],
            $_POST["language"],
            $_POST["votes"],
            isset($_POST["vip"]) ? 1 : 0,
            $id
        ]);
        header("Location: edit_ahnbehg96o1v8qdjjjfhoth2x7cl8f.php");
        exit;
    }
}

if (isset($_GET["edit"])) {
    // Режим редактирования конкретного сервера
    $id = (int)$_GET["edit"];
    $stmt = $pdo->prepare("SELECT * FROM servers WHERE id = ?");
    $stmt->execute([$id]);
    $server = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$server) {
        echo "Сервер не найден!";
        exit;
    }
    ?>
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <title>Редактирование сервера - PixelPing</title>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Press Start 2P', cursive;
                background-color: #1e1e1e;
                color: #fff;
                text-align: center;
            }
            .container {
                max-width: 100%;
                margin: 20px auto;
                padding: 20px;
                background: #3a3a3a;
                border: 4px solid #55aa55;
                box-shadow: 4px 4px 0 #222;
            }
            input, select {
                width: 90%;
                padding: 10px;
                margin: 10px 0;
                border: 4px solid #55aa55;
                background: #222;
                color: #fff;
                font-family: 'Press Start 2P', cursive;
                font-size: 12px;
                box-shadow: 4px 4px 0 #111;
            }
            input[type=submit] {
                background: #55aa55;
                cursor: pointer;
            }
            input[type=submit]:hover {
                background: #77cc77;
            }
            a {
                color: #55aa55;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
    <div class="container">
        <h1>Редактирование сервера</h1>
        <form method="POST">
            <input type="hidden" name="update_id" value="<?= $server['id'] ?>">
            <input type="text" name="name" placeholder="Название сервера" value="<?= htmlspecialchars($server['name']) ?>" required>
            <input type="text" name="ip" placeholder="IP адрес сервера" value="<?= htmlspecialchars($server['ip']) ?>" required>
            <input type="text" name="version" placeholder="Версия" value="<?= htmlspecialchars($server['version']) ?>" required>
            <input type="text" name="language" placeholder="Язык" value="<?= htmlspecialchars($server['language']) ?>">
            <input type="number" name="votes" placeholder="Голоса" value="<?= htmlspecialchars($server['votes']) ?>" required>
            <label><input type="checkbox" name="vip" value="1" <?= $server['vip'] ? 'checked' : '' ?>> VIP</label>
            <input type="submit" value="Сохранить изменения">
        </form>
        <p><a href="edit_ahnbehg96o1v8qdjjjfhoth2x7cl8f.php">Вернуться к списку серверов</a></p>
    </div>
    </body>
    </html>
    <?php
} else {
    // Вывод списка серверов с возможностью редактирования и удаления
    $stmt = $pdo->query("SELECT * FROM servers ORDER BY id ASC");
    $servers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    ?>
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <title>Редактор серверов - PixelPing</title>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Press Start 2P', cursive;
                background-color: #1e1e1e;
                color: #fff;
                text-align: center;
            }
            .container {
                max-width: 100%;
                margin: 20px auto;
                padding: 20px;
                background: #3a3a3a;
                border: 4px solid #55aa55;
                box-shadow: 4px 4px 0 #222;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                padding: 10px;
                border: 4px solid #55aa55;
                text-align: center;
            }
            a {
                color: #55aa55;
                text-decoration: none;
            }
            form {
                display: inline;
            }
            input[type=submit] {
                background: #ff6600;
                border: none;
                padding: 5px 10px;
                cursor: pointer;
                font-family: 'Press Start 2P', cursive;
                font-size: 12px;
            }
            input[type=submit]:hover {
                background: #ffcc00;
            }
        </style>
    </head>
    <body>
    <div class="container">
        <h1>Редактор серверов</h1>
        <table>
            <tr>
                <th>ID</th>
                <th>Название</th>
                <th>IP</th>
                <th>Версия</th>
                <th>Язык</th>
                <th>Голоса</th>
                <th>VIP</th>
                <th>Действия</th>
            </tr>
            <?php foreach ($servers as $server): ?>
            <tr>
                <td><?= $server['id'] ?></td>
                <td><?= htmlspecialchars($server['name']) ?></td>
                <td><?= htmlspecialchars($server['ip']) ?></td>
                <td><?= htmlspecialchars($server['version']) ?></td>
                <td><?= htmlspecialchars($server['language']) ?></td>
                <td><?= $server['votes'] ?></td>
                <td><?= $server['vip'] ? 'Да' : 'Нет' ?></td>
                <td>
                    <a href="edit_ahnbehg96o1v8qdjjjfhoth2x7cl8f.php?edit=<?= $server['id'] ?>">Ред.</a>
                    <form method="POST">
                        <input type="hidden" name="delete_id" value="<?= $server['id'] ?>">
                        <input type="submit" value="Удалить">
                    </form>
                </td>
            </tr>
            <?php endforeach; ?>
        </table>
        <p><a href="/">Вернуться на главную</a></p>
    </div>
    </body>
    </html>
    <?php
}
?>
