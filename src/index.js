require('file-loader?name=[name].[ext]!./index.html');
require('./style.css');

document.querySelector('button').addEventListener('click', e => console.log('World'));
