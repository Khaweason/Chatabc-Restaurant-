<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ChatABC Admin Login</title>
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="admin.css">
</head>
<body>
    <div class="login-container">
        <form class="login-form" method="POST">
            <div class="login-header">
                <h1>ChatABC</h1>
                <p>Admin Dashboard Login</p>
            </div>
            
            <?php if (isset($login_error)): ?>
                <div class="login-error">
                    <?php echo htmlspecialchars($login_error); ?>
                </div>
            <?php endif; ?>
            
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" name="login" class="btn btn-primary" style="width: 100%;">Login</button>
            
            <div style="margin-top: 1rem; text-align: center; color: #999; font-size: 0.9rem;">
                <p>Demo Credentials:</p>
                <p>Username: admin | Password: chatABC2024</p>
            </div>
        </form>
    </div>
</body>
</html>