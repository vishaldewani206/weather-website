const path = require('path')
const express = require('express')
const hbs = require("hbs")
const forecast = require('./utlis/forecast')
const geocode = require("./utlis/geocode")

const app = express()
const port = process.env.PORT || 3000

//define paths for express config
const publicDirectoryPath = path.join(__dirname, "../public")
const viewsPath =  path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//setup handlebars engine and view location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))


app.get("", (req,res)=>{
    res.render('index',{
        title: "Weather",
        name: "Vishal Dewani"
    })
})

app.get("/about", (req,res)=>{
    res.render('about', {
        title: 'About Me',
        name: 'Vishal Dewani'
    })
})

app.get("/help", (req,res)=>{
    res.render('help', {
        message: "This is a help page kindly ask anything",
        title: 'Help',
        name: "Vishal"
    })
})

app.get("/weather", (req,res)=>{
    if(!req.query.address){
        return res.send({
            error: "No address was given"
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location}={})=>{
        if(error){
            return res.send({error})

        }
        forecast(latitude, longitude, (error, forecastData)=>{
            if(error){
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req,res)=>{
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    res.send({
        products: []
    })
})

app.get('/help/*',(req,res)=>{
    res.render("404", {
        error: "Help Article not found",
        title: 'Help',
        name: "Vishal"
    })
})

app.get('*',(req,res)=>{
    res.render("404",{
        error: "404 Page Not Found",
        title: 'Help',
        name: "Vishal"
    })
})



app.listen(port, ()=>{
    console.log('Server is up on port 3000')
})