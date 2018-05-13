# microsmith

A static blog generator based on [Metalsmith](http://www.metalsmith.io/) and inspired to [Micro.blog](https://micro.blog)

This project aims to be a boilerplate to build a micro blog and publish your articles easily.

## How to

**Requirements**

Nodejs is needed to run this application.
Proceed with the installation if you don't have it.

 - Visit the homepage: https://nodejs.org/
 - Or,if you have MacOS and brew: `brew install node`

**Dependencies**

Install dependencies as usual for any nodejs application.
From the root folder of the project: `npm install`

**Run it**

`npm start`

**Write some posts**

Check the `posts/` folder and add a new markdown file there.
Be sure to add the required values for _title_, _description_, _layout_ and _date_. The order doesn't matter.

```md
---
title: A New Post is Born
description: How I ended up micro-blogging
date: 2018-05-13T17:00:00Z
layout: default.html
---

The full content here lorem ipsum...

```

The final website will be available in the `dist/` folder.
