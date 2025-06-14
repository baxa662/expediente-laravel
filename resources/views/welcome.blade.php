<!DOCTYPE html data-theme="fantasy">
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

    <title>Laravel</title>
    @viteReactRefresh
    @vite('resources/js/main.jsx')
</head>

<body>
    <div id="root">
    </div>
</body>

</html>