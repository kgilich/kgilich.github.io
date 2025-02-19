---
layout: terezka
title: Rande s Terezkou
---

<div id="password-screen">
    <h1>Vítej!</h1>
    <input type="password" id="password" placeholder="Zadej heslo">
    <button onclick="checkPassword()">Odemknout</button>
    <p id="error-message" class="hidden">Nesprávné heslo!</p>
</div>

<div id="content" class="hidden">
    <h1>Dnešní tip na rande:</h1>
    <p id="date"></p>
    <p id="idea"></p>
</div>

<script src="{{ '/assets/js/script.js' | relative_url }}"></script>