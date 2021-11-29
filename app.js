// SETUP //
require('dotenv').config(); 
const fileupload     = require('express-fileupload');
const methodOverride = require('method-override');
const cookieSession  = require('cookie-session')
const express        = require('express');
const bcrypt         = require('bcrypt');
const app            = express();

// MIDDLEWARES //
const recursivo      = require('./middleware/recursivo');
const descargar      = require('./middleware/descargar');
const eliminar       = require('./middleware/eliminar');
const accion         = require('./middleware/accion');
const subir          = require('./middleware/subir');
const { checkRol }   = require('./middleware/rol');

// VARIABLES //
const rutaRaiz       = process.env.RUTA_LOCAL;
let allDirectories   = [];
let allFiles         = [];
let dirFilter        = [];
let nomRutas         = [];


// CONFIGURACIÓN DE FUNCIONAMIENTO //
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(fileupload());
app.use(cookieSession({
    name: 'session',
    keys: [process.env.SECRET_SESSION],
    maxAge: 3 * 60 * 60 * 1000
}));
/* RUTAS ESTATICAS PARA ARCHIVOS DE ESTILO, SCRIPTS Y NODE_MODULES */
app.use('/assets', express.static('views/assets'));
app.use('/script', express.static('views/script'));
app.use('/jquery', express.static('node_modules/jquery'));
app.use('/bootstrap', express.static('node_modules/bootstrap'));
app.use('/popper', express.static('node_modules/@popperjs'));

// DESPLIEGUE //
actualizar();

// METODOS HTTPs //
// GETs //
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    actualizar();
    let modo = checkRol(req)
    res.cookie('position', '/');
    res.render('index.ejs', {data: recursivo.directorio('/', allFiles, dirFilter), rutas: nomRutas, rol: modo});
});

// POSTs //
/* LOGIN */
app.post('/login', async (req, res) => {
    if (req.body.nombre == process.env.USER_LOGIN && await bcrypt.compareSync(req.body.password, process.env.PASSWORD_LOGIN)) {
        req.session.user = process.env.ROL_HIGH;
    }
    res.redirect(req.get('referer'));
});

/* LOGOUT */
app.post('/logout', async (req, res) => {
    req.session = null;
    res.redirect(req.get('referer'));
});

/* SUBIR */
app.post('/subir', async (req, res) => {
    subir.run(rutaRaiz, req, res);
    res.redirect(req.get('referer'));
});

/* DESCARGAR */
app.post('/descargar', async (req, res) => {
    descargar.run(rutaRaiz, req, res);
    res.download(rutaArchivo);
});

/* ACCION */
app.post('/accion', async (req, res) => {
    res.end();
});

// DELETEs //
/* ELIMINAR */
app.delete('/eliminar', async (req, res) => {
    eliminar.run(rutaRaiz, req, res);
    res.redirect(req.get('referer'));
});

// PUERTO DE DESPLIGUE //
app.listen(process.env.PORT_APP);

// FUNCIONES //
/* ACTUALIZAR */
/* PARAMETROS: NO */
/* RETURN: NADA */
/* SE ENCARGA DE HACER LA RECURSIVIDAD DE LOS DIRECTORIOS Y GENERAR LOS CONTENIDOS DE LAS VARIABLES */
/* UNA VEZ CONTIENE LOS DATOS, CREA METODOS HTTP GET CON LAS RUTAS DE DIRECTORIOS PARA CONECTARNOS */
function actualizar() {
    let data = recursivo.recursivo(rutaRaiz);
    allDirectories = data[0];
    allFiles = data[1];
    dirFilter = data[2];
    nomRutas = data[3];
    nomRutas.forEach(nom => {
        transformado = encodeURI(nom);
        if (nom.charAt(0) != '/') {
            transformado = '/' + transformado;
        }
        app.get(transformado, async (req, res) => {
            let modo = checkRol(req)
            actualizar();
            let data = recursivo.directorio(nom, allFiles, dirFilter);
            res.cookie('position', nom);
            res.render('index.ejs', {data: data, rutas: nomRutas, rol: modo});
        });
    });
};


