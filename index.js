const xml2js = require('xml2js')
const Q = require('q');
const fs = require('fs')
const CargoQueue = require('async/cargoQueue')

const mongoose = require('mongoose');
const Metadata = require('./Metadata');

mongoose.Promise = global.Promise;

var parser = new xml2js.Parser();


const dbQueue = CargoQueue(async function(docs, cb){
    await Metadata.insertMany(docs);
    cb()
}, 20, 20)

dbQueue.drain(function() {
    console.log('all items have been saved');
});

const extractMetadata = async (fileString) => {

    const deferred = Q.defer()

    parser.parseString(fileString, async function(err, result){
        if(err){
            console.error("Error in parsing xml : "+err);
            deferred.reject()
        }
        const metadata = {}
        try{
            const bookData = result["rdf:RDF"]["pgterms:ebook"][0]
            metadata['title'] = bookData["dcterms:title"][0]
            metadata['id'] = bookData["$"]["rdf:about"].split("/")[1]
            metadata['language'] = bookData["dcterms:language"][0]["rdf:Description"][0]["rdf:value"][0]["_"]
            metadata['publisher'] = bookData["dcterms:publisher"][0]
            metadata['publication_date'] = new Date(bookData["dcterms:issued"][0]["_"])
            metadata["subjects"] = []
            for(let subjectIndex in bookData["dcterms:subject"]){
                if(!bookData["dcterms:subject"][subjectIndex]["rdf:Description"]){
                    continue;
                }
                metadata["subjects"].push(bookData["dcterms:subject"][subjectIndex]["rdf:Description"][0]["rdf:value"][0])
            }

            metadata["authors"] = []
            for(let authorIndex in bookData["dcterms:creator"]){
                if(!bookData["dcterms:creator"][authorIndex]["pgterms:agent"]){
                    continue;
                }
                metadata["authors"].push(bookData["dcterms:creator"][authorIndex]["pgterms:agent"][0]["pgterms:name"][0])
            }
            metadata["license_rights"] = bookData["dcterms:rights"][0]
            metadata["id"] =  parseInt(metadata["id"])
            deferred.resolve(metadata)

        }catch(e){
            console.error(metadata)
            console.error("Error in setting metadata, due to inconsistent schema: "+e);
            deferred.reject()
        }
    })

    return deferred.promise
}


const getDirectories = (source) =>
  fs.readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => source+dirent.name)


const booksPaths = getDirectories(__dirname+"/cache/epub/");

const readFilePath = async (bookPath) => {
    
    var files = fs.readdirSync(bookPath)
    fs.readFile(bookPath+"/"+files[0], async function(err, fileString){
            try{
                let metadata = await extractMetadata(fileString)
                let metadataObject = new Metadata(metadata);
                metadataObject._id = metadata['id']
    
                dbQueue.push(metadataObject)
    
                // console.log(metadata)
            }catch(e){
                console.log("No data received")
            }
    })
    

}




function readAllBooks(){

    mongoose.connect("mongodb://localhost:27017/bibliu").then(() => {
        console.info(booksPaths.length);
        var cargoQueue = CargoQueue(async function(tasks, callback) {
            for (var i=0; i<tasks.length; i++) {
                await readFilePath(tasks[i]);
            }
            callback();
        }, 20, 20);
    
        cargoQueue.push(booksPaths)    

    })
    .catch((err) => {
        console.error(err);
        console.info('MongoDB connection error. Please make sure MongoDB is running.');
        process.exit();
    })

}

readAllBooks()



module.exports = extractMetadata
