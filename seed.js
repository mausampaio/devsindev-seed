require('dotenv').config();
const axios = require('axios');
const formData = require('form-data');
const fs = require('fs');
const download = require('image-downloader');

const downloadImage = async (githubUrl, fileName) => {
  const options = {
    url: `${githubUrl}.png`,
    dest: `./assets/images/${fileName}.png`
  };

  try {
    const filename = await download.image(options);
    console.log('Saved to', filename);

    return filename;
  } catch (err) {
    console.error(err);
  }
};

const createImage = async (githubUrl, fileName) => {
  const result = await downloadImage(githubUrl, fileName);

  console.log(result.filename)

  const formdata = new formData();
  formdata.append('foto', fs.createReadStream(result.filename));

  const imageResult = await axios.post(`http://${process.env.SAILS_HOST}:${process.env.SAILS_PORT}/files/upload`, formdata, {
    headers: formdata.getHeaders()
  });

  return imageResult.data;
};



const createUser = (user) => {
  axios.post(`http://${process.env.SAILS_HOST}:${process.env.SAILS_PORT}/v1/usuarios`, user)
      .then(response => {
          const addedUser = response.data;
          console.log(`POST: user is added`, addedUser);
      })
      .catch(error => console.error(error));
};

const users = [
  {
    nome: "Maurício Sampaio",
    idade: 32,
    linkedin: "https://www.linkedin.com/in/mausampaio/",
    github: "https://github.com/mausampaio"
  },
  {
    nome: "Ricardo Nascimento",
    idade: 30,
    linkedin: "https://www.linkedin.com/in/michaelnsc/",
    github: "https://github.com/mikansc"
  },
  {
    nome: "Alanderson Santana",
    idade: 22,
    linkedin: "https://www.linkedin.com/in/alandersonsds/",
    github: "https://github.com/alandersonsds"
  }
]

users.forEach(async user => {
  const image = await createImage(user.github, user.github.replace('https://github.com/', ''));

  const data = {
    ...user,
    foto: image.id
  }

  createUser(data);
});
