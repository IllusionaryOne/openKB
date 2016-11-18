//
// Import exported MD files from export.zip into an NeDB based openKB.
// If MongoDB is desired, start with NeDB then run the convert script.
//
// Note that due to there being very little data in the export there
// have to be some default values provided for certain fields.  
//
// Run this script from the data/ directory.  Unzip your export.zip file
// into the data/export directory.
//
// Author @illusionaryone

var Nedb = require('nedb');
var async = require('async');
var path = require('path');
var common = require('../routes/common');
var fs = require('fs');

function importKB() {

    // Remove an existing database that we would create.
    if (fs.existsSync('import.kb.db')) {
        console.log('Removing old import.kb.db');
        fs.unlink('import.kb.db');
    }

    var ndb = new Nedb(path.join(__dirname, 'import.kb.db'));
    ndb.loadDatabase();

    fs.readdir('export', (err, files) => {
        files.forEach(file => {
            console.log('Processing export/' + file);
            fs.readFile('export/' + file, 'utf8', function(err, data) {
                if (err) {
                    console.log('-> Error: ' + err);
                    return;
                }

                var doc = {
                    kb_permalink: file.replace('\.md', '').replace(/\s+/g, ''),
                    kb_title: file.replace('\.md', ''),
                    kb_body: data,
                    kb_published: 'true',
                    kb_keywords: '',
                    kb_password: '',
                    kb_published_date: new Date(),
                    kb_last_updated: new Date(),
                    kb_featured: false,
                    kb_last_update_user: 'UserName - username@nowhere.com', // Change this, of course
                    kb_author: 'UserName', // Change this, of course
                    kb_author_email: 'username@nowhere.com', // Change this, of course
                    kb_seo_title: file.replace('\.md', ''),
                    kb_seo_description: data
                };
    
                ndb.insert(doc, function(err, newDoc) {
                    if (err) {
                        console.log('-> Error: ' + err);
                        return;
                    }
                });
            });
        });
        console.log('Process Completed. Please backup your current kb.db if it exists and replace with import.kb.db');
    });
};

importKB();
