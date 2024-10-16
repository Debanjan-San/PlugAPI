
# PlugAPI 🚀

PlugAPI is a modular, plug-and-play API system built using [TypeScript](https://www.typescriptlang.org/), [Express](https://expressjs.com/), and [EJS](https://ejs.co/). It allows developers to easily add or modify plugins without altering the core structure. Each plugin is loaded dynamically, and the API documentation updates automatically on the website without the need for manual HTML edits.

## ✨ Features

- ⚙️ **Plug-and-Play Architecture**: Easily add new features or APIs by creating plugins. The system automatically loads all available plugins from the plugins directory.
- 🧩 **Modular Design**: Every plugin is a self-contained module that handles specific API routes, keeping the core code clean and organized.
- 📐 **TypeScript Powered**: Written in TypeScript for better type safety, development experience, and maintainability.
- 🌐 **Express.js Integration**: Utilizes Express.js for routing and middleware, making it flexible and easy to extend.
- 🎨 **EJS Templating**: The API uses EJS for dynamic rendering of web pages, including automatically updating API documentation.

## 🛠 Tech Stack

- 📝 **Language**: [TypeScript](https://www.typescriptlang.org/)
- 🔌 **Backend Framework**: [Express.js](https://expressjs.com/)
- 📄 **View Engine**: [EJS](https://ejs.co/)
- 🛠 **Build Tool**: [TypeScript Compiler (tsc)](https://www.typescriptlang.org/)

## 🚀 Getting Started

### 📦 Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/YourUsername/PlugAPI.git
    cd PlugAPI
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Build the project**:
    ```bash
    npm run build
    ```

4. **Start the API**:
    ```bash
    npm start
    ```

5. **Access the API**:
   Visit [http://localhost:3000](http://localhost:3000) to view the running API and documentation.

### 📑 Available API Methods

| Name                         | Method | Route                                             | Parameters                                       | Description                                      |
|------------------------------|--------|---------------------------------------------------|--------------------------------------------------|--------------------------------------------------|
| `getAudioInfoAndLink`        | GET    | `/api/getAudioInfoAndLink`                        | `link` (YouTube URL)                             | API for getting audio information and links       |
| `getTranslate`               | GET    | `/api/getTranslate`                               | `langTo` (language code), `text` (text to translate) | API for text translation                         |
| `getVideoInfoAndLinks`       | GET    | `/api/getVideoInfoAndLinks`                       | `link` (YouTube URL)                             | API for getting video information and links       |
| `imageSearch`                | GET    | `/api/imageSearch`                                | `query` (search term)                            | API for searching images                          |
| `instaDownloader`            | GET    | `/api/instaDownloader`                            | `link` (Instagram URL)                           | API for getting video information and links from Instagram |
| `pinterest`                  | GET    | `/api/pinterest`                                  | `query` (search term)                            | API for searching images on Pinterest             |

## 🔌 Adding or Modifying Plugins

PlugAPI is designed around plugins that handle specific functionalities of the API. Adding or modifying a plugin is easy, and the system automatically detects new plugins and updates the API documentation displayed on the website.

### 📂 Plugin Template Example

```typescript
import { Router } from 'express';
import { Plugin } from '../types/index';

const myPluginLogic = async () => {
    return { message: 'Hello from MyPlugin!' };
};

export default (): Plugin => {
    return {
        name: 'MY_PLUGIN',
        description: 'An example plugin to demonstrate how to add a plugin',
        parameter: 'query=(optional parameter)',
        route: '/api/myplugin',
        run: (router: Router) => {
            router.get('/myplugin', async (req, res) => {
                const response = await myPluginLogic();
                res.status(200).json(response);
            });
        },
    };
};
```

### 📜 Steps to Add a Plugin

1. Inside the `src/plugins` directory, create a new TypeScript file for your plugin, e.g., `myPlugin.ts`.
2. Implement the plugin using the template above, defining the route, parameters, and API logic.
3. Restart the server: `npm start`

After restarting, visit [http://localhost:3000/docs](http://localhost:3000/docs) to see the updated list of APIs.

## 🤝 Contributing

1. **Fork the repository**.
2. **Create a new branch**: `git checkout -b feature-branch`
3. **Make your changes and commit them**: `git commit -m 'Add some feature'`
4. **Push to the branch**: `git push origin feature-branch`
5. **Create a pull request**.

## 📄 License

PlugAPI is licensed under the MIT License.