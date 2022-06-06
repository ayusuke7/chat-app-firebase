# A simple chat applicatoin with React/Typescritp and Firebase Auth/Database

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

![screen app](./docs/captura.png)

## Get started

Before installing on your local machine, go create an account on [Firebase](https://firebase.google.com), after you've created an account, click the create project, then enter the project name, see example below

![firebase project name](./docs/1.webp)

Follow the next step, and after you've created your project in Firebase, you'll see something like this

![](./docs/2.webp)

hit the `</>` button and register your app, enter the name, and click register app, after that, copy the **_entire object key and value_** in the `firebaseConfig` constant, see picture below

![](./docs/3.webp)

## Installing on your local maching

Clone this repo

```bash
git clone https://github.com/ayusuke7/ChatApp .
```

Install all the packages

```bash
npm install
```

after you've copied the firebase config object, create a `.env` file in the root of this project, copy the variable in `.env.example` file and paste it in `.env` file along with your firebase config, and you're ready.
