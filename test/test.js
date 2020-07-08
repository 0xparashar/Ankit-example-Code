var assert = require('assert');
var fs = require('fs');
var extractMetadata = require('../index')

describe("Metadata Extractor", function(){
    




    it("should return metadata for pg1.rdf file", async function(){

        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)
        
        assert.ok(resultMetadata)
        
    })

    it("should return pg1.rdf title", async function(){
        
        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)
        console.info(resultMetadata);
        assert.equal(resultMetadata.title ,"The Declaration of Independence of the United States of America")
   
    })

    it("should return pg1.rdf id", async function(){
        
        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)

        assert.equal(resultMetadata.id ,1)
   
    })

    it("should return pg1.rdf id", async function(){
        
        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)

        assert.equal(resultMetadata.id ,1)
   
    })

    it("should return 4 pg1.rdf subjects", async function(){
        
        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)

        assert.equal(resultMetadata.subjects.length ,4)
   
    })

    it("should return 1 pg1.rdf author", async function(){
        
        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)

        assert.equal(resultMetadata.authors.length ,1)
   
    })    

    it("should return pg1.rdf language as en", async function(){
        
        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)

        assert.equal(resultMetadata.language , "en")
   
    })

    it("should return pg1.rdf publisher as Gutenberg", async function(){
        
        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)

        assert.equal(resultMetadata.publisher , "Project Gutenberg")
   
    })

    it("should return pg1.rdf publication date as 1971-01-12", async function(){
        
        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)

        assert.equal(resultMetadata.publication_date.getMilliseconds(), new Date("1971-01-12").getMilliseconds())
   
    })

    it("should return pg1.rdf license rights", async function(){
        
        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)

        assert.equal(resultMetadata.license_rights, "Public domain in the USA.")
   
    })
    
    it("should return pg1.rdf authors", async function(){
        
        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)

        assert.deepEqual(resultMetadata.authors, ["Jefferson, Thomas"])
   
    })

    it("should return pg1.rdf subjects", async function(){
        
        var databuffer = fs.readFileSync(__dirname+"/../pg1.rdf");
        var resultMetadata = await extractMetadata(databuffer)

        assert.deepEqual(resultMetadata.subjects, ["United States. Declaration of Independence","JK","United States -- History -- Revolution, 1775-1783 -- Sources","E201"])
   
    })

})
