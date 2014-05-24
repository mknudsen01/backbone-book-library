var application_root = __dirname,
    express = require( 'express' ),
    path = require( 'path' ),
    mongoose = require( 'mongoose' );

var app = express();

app.configure( function() {
  app.use( express.bodyParser() );
  app.use( express.methodOverride() );
  app.use( app.router );
  app.use( express.static( path.join( application_root, 'site' ) ) );
  app.use( express.errorHandler({ dumpExceptions: true, showStack: true}));
});

//DATABASE:
mongoose.connect( 'mongodb://localhost/library_database' );

var Book = new mongoose.Schema({
  title: String,
  author: String,
  releaseDate: Date
});

var BookModel = mongoose.model( 'Book', Book );
var port = 4711;
app.listen( port, function() {
  console.log( 'Express server listening on port %d in %s mode', port, app.settings.env);
});

//ROUTES:
app.get('/api', function( request, response ) {
  response.send( 'Library API is running' );
});
app.get('/api/books', function( request, response ){
  return BookModel.find( function( err, books ){
    if( !err ){
      return response.send( books );
    } else {
      return console.log( err );
    }
  });
});
app.get('/api/books/:id', function( request, response ) {
  return BookModel.findById( request.params.id, function( err, book ) {
    if( !err ) {
      return response.send( book );
    } else {
      return console.log( err );
    }
  });
});

app.post( '/api/books', function( request, response ) {
  var book = new BookModel({
    title: request.body.titele,
    author: request.body.author,
    releaseDate: request.body.releaseDate
  });

  return book.save( function( err ) {
    if ( !err ) {
      console.log('created');
      return response.send( book );
    } else {
      console.log( err );
    }
  });
});

app.put( '/api/books/:id', function( request, response ) {
  console.log( 'Updating book ' + request.body.title );
  return BookModel.findById( request.params.id, function( err, book) {
    book.title = request.body.title;
    book.author = request.body.author;
    book.releaseDate = request.body.releaseDate;

    return book.save( function( err ) {
      if( !err ) {
        console.log( 'book updated' );
        return response.send( book );
      } else {
        console.log( err );
      }
    });
  });
});