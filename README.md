# Manga Reader - Chatbot WhatsApp and Telegram

<p align="center">
    <img src="https://raw.githubusercontent.com/jjeanjacques10/mangajj/main/files/MangaJJLogo.jpg" width="300"/>
    <br />
    <br />
    <a href="https://mangajj.herokuapp.com/manga?limit=10&page=0&title=Naruto">Demo</a>
    ·
    <a href="https://github.com/jjeanjacques10/mangajj-whatsapp/issues">Report Bug</a>
    ·
    <a href="https://github.com/jjeanjacques10/mangajj-whatsapp/issues">Request Feature</a>
</p>

<p align="center">
   <a href="https://www.linkedin.com/in/jjean-jacques10/">
      <img alt="Jean Jacques Barros" src="https://img.shields.io/badge/-JeanJacquesBarros-FFCC00?style=flat&logo=Linkedin&logoColor=white" />
   </a>
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/jjeanjacques10/mangajj-whatsapp?color=FFCC00">

  <a href="https://github.com/jjeanjacques10/mangajj-whatsapp/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/jjeanjacques10/mangajj-whatsapp?color=FFCC00">
  </a>
  <img alt="License" src="https://img.shields.io/badge/license-MIT-FFCC00">
  <img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/jjeanjacques10/mangajj-whatsapp?color=FFCC00" />
  <a href="https://github.com/jjeanjacques10/mangajj-whatsapp/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/jjeanjacques10/mangajj-whatsapp?color=FFCC00&logo=github">
  </a>
</p>

This is a simple chatbot for WhatsApp that allows you to read manga from the internet. It was developed using the [Venom Bot](https://github.com/orkestral/venom) library and the [MangaJJ Scrapper Pages API](https://github.com/jjeanjacques10/manga-scrapper-api) to get the manga chapters.

## Getting started

1. Install the dependencies

```bash
npm install
```

2. Run the project - Select the platform `whatsapp` or `telegram`

```bash
npm start <platform>
```

3. If whatsapp so scan the QR code with your WhatsApp

<img src="./files/qrcode.png" width=400/>

4. Send the name and chapter number of the manga you want to read

Example: `/mangabot Naruto 698`

<table>
    <tr>
        <td align="center">
            <h3>WhatsApp</h3>
            <img src="./files/whatsapp.png" width=400/>
        </td>
        <td align="center">
            <h3>Telegram</h3>
            <img src="./files/telegram.png" width=350/>
            <a href="https://t.me/mangajjbot">Demo</a>
        </td>
    </tr>
</table>

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file if using the `telegram` platform:

``` .env
TELEGRAM_BOT_TOKEN=
```

## Integrations

This project integrates with the following services:

- [WhatsApp - Venom Bot](https://github.com/orkestral/venom)
- [MangaJJ Scrapper Pages API](https://github.com/jjeanjacques10/manga-scrapper-api)

<img src="./files/diagram.jpg"/>

## License

[MIT License](LICENSE)

## ⚠ Atention ⚠

This project is for study purposes only, I do not encourage piracy. If you like the manga, buy it. If you want to read it for free, go to the official website. I am not responsible for any misuse of this project.

---
Developed by [Jean Jacques Barros](https://github.com/jeanjacques10)
