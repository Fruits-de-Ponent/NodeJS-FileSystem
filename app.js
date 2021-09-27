const { throws } = require('assert');
const { dir } = require('console');
const { get } = require('http');
const { arch } = require('os');
const express = require('express')
const path = require('path');
const fs = require('fs');
const app = express()
const Directorio = require('./clases/directorio');

// Variables
const rutaRaiz = '//Serverdoc/e/z_Informatica/Z_Documentacio/'
const nivelU = []
const nivelD = []
const nivelT = []
const nivelC = []

// Config
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    try {
        inicializar(rutaRaiz)
        estructura.forEach(dir => {
            app.get('/' + dir.getNombre(), (req, res) => {
                res.render('index.ejs', { estructura: estructura[1].getNombre() })
            })
        })
    } catch (e) {
        console.log('Error en la inicialización.')
    }
    res.render('index.ejs', { estructura: estructura[1].getNombre() })
})




app.listen(3000)

async function inicializar(ruta) {
    await fs.readdirSync(ruta).forEach(dir => {
        if(!dir.includes('.')){
            let dirObj = new Directorio(dir, (ruta + dir + '/'), '/')
            dirObj.setArchivos(dirObj.getFiles())
            dirObj.setSubDirectorios(dirObj.getInnerDir())
            estructura.push(dirObj)
        }
    });
    console.log('EST: ' + estructura)
    estructura.forEach(dir => {
        console.log('dir ' + dir.getPadre())
        directorios.push(dir.getSubDirectorios())
    })
    directorios.forEach(dir => {
        directorios.push(dir.getPadre())
    })
}