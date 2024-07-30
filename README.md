# Celia

[![Static Badge](https://img.shields.io/badge/chat%20on%20Telegram-blue?logo=telegram&logoColor=white)](https://t.me/CeliaMekoBot) [![GitHub License](https://img.shields.io/github/license/ridzimeko/celia-bot)](https://github.com/ridzimeko/celia-bot/blob/main/LICENSE) [![issues](https://img.shields.io/github/issues/ridzimeko/celia-bot)](https://github.com/ridzimeko/celia-bot/issues)

## Description

Celia is a simple group Management bot that allows you to moderate your Telegram group. You must be an administrator to use this bot.

Can be found on Telegram at [@CeliaMekoBot](https://t.me/CeliaMekoBot)

## Features

-   Promote, demote, ban, mute, and unban users
-   Pin and unpin messages
-   Translate messages using DeepL API

## TODO

-   [ ] Clean services messages (eg. new member, pin message, forum topic etc.)
-   [ ] Add support for other languages **(currently it's only Indonesian)**
-   [ ] Manage groups settings in the bot
-   [ ] Notes and filters in groups

## Installation

1. Clone the repository:

```bash
git clone https://github.com/ridzimeko/celia-bot.git
```

2. Install the required dependencies:

```bash
npm install
```

3. Build the code:

```bash
npm run build
```

4. Copy `.env.example` file to `.env` and set up the environment variables:
    - `BOT_TOKEN`: The token for your bot.
    - `MONGODB_URL`: The URL for your MongoDB database.
    - `BOT_CHATID_LOG`: The chat ID for logging purposes.
    - `DEEPL_API_KEY`: The API key for DeepL translation.
5. Start the bot:

```bash
npm start
```

And done! Your bot is now ready to use, type `/help` to get all the available commands.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the GPL-3.0-only License. See the [LICENSE](LICENSE) file for more details.
