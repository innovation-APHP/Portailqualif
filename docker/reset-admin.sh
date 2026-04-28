#!/bin/bash

# Script de réinitialisation des identifiants administrateur
# À utiliser en cas de perte du mot de passe

echo "=========================================="
echo "  RÉINITIALISATION ADMIN - PORTAIL QUALITÉ"
echo "=========================================="
echo ""
echo "Ce script va réinitialiser les identifiants administrateur"
echo "aux valeurs par défaut :"
echo "  - Nom d'utilisateur: admin"
echo "  - Mot de passe: admin123"
echo ""
read -p "Êtes-vous sûr de vouloir continuer ? (oui/non) : " confirm

if [ "$confirm" != "oui" ]; then
    echo "Opération annulée."
    exit 0
fi

echo ""
echo "🔄 Réinitialisation en cours..."

# Accéder au conteneur frontend et exécuter la commande de réinitialisation
docker-compose exec frontend sh -c "cat > /usr/share/nginx/html/reset-admin.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Réinitialisation Admin</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { color: #2563eb; }
        .success {
            background: #dcfce7;
            border: 1px solid #86efac;
            color: #166534;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .info {
            background: #dbeafe;
            border: 1px solid #93c5fd;
            color: #1e40af;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        button {
            background: #2563eb;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover { background: #1d4ed8; }
        code {
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔓 Réinitialisation Administrateur</h1>

        <div class="info">
            <strong>Cette page va réinitialiser les identifiants administrateur.</strong>
            <br><br>
            Identifiants par défaut :
            <ul>
                <li>Nom d'utilisateur : <code>admin</code></li>
                <li>Mot de passe : <code>admin123</code></li>
            </ul>
        </div>

        <button onclick="resetAdmin()">Réinitialiser maintenant</button>

        <div id="result"></div>
    </div>

    <script>
        function resetAdmin() {
            // Supprimer les identifiants personnalisés
            localStorage.removeItem('quality_portal_admin_username');
            localStorage.removeItem('quality_portal_admin_password');
            localStorage.removeItem('quality_portal_admin_token');

            // Afficher le message de succès
            document.getElementById('result').innerHTML =
                '<div class="success">' +
                '<strong>✅ Réinitialisation réussie !</strong><br><br>' +
                'Les identifiants administrateur ont été réinitialisés :<br>' +
                '• Nom d\'utilisateur : <code>admin</code><br>' +
                '• Mot de passe : <code>admin123</code><br><br>' +
                'Vous pouvez maintenant vous connecter avec ces identifiants.<br><br>' +
                '<a href="/" style="color: #2563eb;">← Retour à l\'accueil</a>' +
                '</div>';
        }
    </script>
</body>
</html>
EOF"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Réinitialisation terminée avec succès !"
    echo ""
    echo "📝 Instructions :"
    echo "   1. Ouvrez votre navigateur"
    echo "   2. Allez sur : http://localhost:3000/reset-admin.html"
    echo "   3. Cliquez sur 'Réinitialiser maintenant'"
    echo "   4. Reconnectez-vous avec : admin / admin123"
    echo ""
else
    echo ""
    echo "❌ Erreur lors de la réinitialisation"
    echo "   Vérifiez que le conteneur frontend est bien démarré"
    echo ""
fi
