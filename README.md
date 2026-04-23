# HGQ287's Portfolio

This is my professional portfolio website showcasing my projects and skills.

## Getting Started

These instructions will guide you on how to **set up** and run the portfolio website on your local machine for development purposes.

### Prerequisites

Make sure you have the following installed:

* **Node.js:** Ensure Node.js is installed on your system. You can download it from [nodejs.org](https://nodejs.org/).
* **Yarn:** Yarn is a package manager for Node.js. If you don't have it installed, you can install it using npm (which comes with Node.js):

    ```sh
    npm install --global yarn
    ```

### Development Environment Setup

1.  **Clone the repository:**

    ```sh
    git clone git@github.com:hgq287/hgq287.github.io.git
    cd hgq287.github.io
    ```

2.  **Install dependencies:**
    ```sh
    yarn install
    ```

3.  **Start the development server:**
    ```sh
    yarn dev
    ```

## Building the Portfolio

Follow these steps to create a production-ready build of your portfolio website.

```sh
npm run build
```

## Deployment to GitHub Pages

Uses `npm` so the lockfile in use (`package-lock.json`) matches the build. If you use Yarn 3, run `yarn install` once so `yarn.lock` stays in sync with `package.json`, then `yarn build` is fine too.

```sh
npm run deploy
```

That's all!