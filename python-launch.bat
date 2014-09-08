cd deploy
start python -m http.server 8080
timeout 1
start "test" "http://127.0.0.1:8080"