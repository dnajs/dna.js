// dna.js
// Mocha Specification Cases

// Imports
import assert from    'assert';
import { JSDOM } from 'jsdom';
import jQuery from    'jquery';

// Setup
import { dna } from '../dist/dna.esm.js';
const mode =     { type: 'ES Module', file: 'dist/dna.esm.js' };
const filename = import.meta.url.replace(/.*\//, '');  //jshint ignore:line
const html = `
   <!doctype html>
   <html lang=en>
      <head>
         <meta charset=utf-8>
         <title>Specification Runner</title>
      </head>
      <body>
         <h1>Featured Books</h1>
         <section class=books>
            <div id=book class=dna-template>
               <h2>~~title~~</h2>
               Author: <cite>~~author~~</cite>
            </div>
         </section>
      </body>
   </html>
   `;
const dom =      new JSDOM(html);
const $ =        jQuery(dom.window);
const setupEnv = (done) => dna.initGlobal(dom.window, $) && done();

// Mock data
const bookCatalog = [
   { title: 'The DOM',      author: 'Jan',  price: 2499, sale: false, language: 'en' },
   { title: 'Styling CSS3', author: 'Abby', price: 1999, sale: true,  language: 'fr' },
   { title: 'Howdy HTML5',  author: 'Ed',   price: 2999 },
   ];

// Specification suite
describe(`Specifications: ${filename} - ${mode.type} (${mode.file})`, () => {
   before(setupEnv);

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Function dna.templateExists()', () => {

   it('identifies if a template is present before cloning', () => {
      const actual =   [dna.templateExists('book'), dna.templateExists('bogus')];
      const expected = [true, false];
      assert.deepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Template cloning function dna.clone()', () => {

   it('creates a book with the correct title', () => {
      dna.clone('book', bookCatalog[0]);
      const actual =   { title: $('.book h2').text() };
      const expected = { title: bookCatalog[0].title };
      assert.deepStrictEqual(actual, expected);
      });

   it('creates a book with the correct author', () => {
      const actual =   { author: $('.book cite').text() };
      const expected = { author: bookCatalog[0].author };
      assert.deepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Function dna.getModel()', () => {

   it('returns the data object for the clone', () => {
      dna.clone('book', bookCatalog[1]);
      const actual =   { model: dna.getModel($('.book').last()) };
      const expected = { model: bookCatalog[1] };
      assert.deepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Plugin call clone.dna("refresh")', () => {

   it('updates the displayed title of a book', () => {
      const clones = dna.clone('book', bookCatalog, { empty: true });
      dna.getModel(clones.first()).title = 'The DOM 2.0!';
      clones.first().dna('refresh');
      const titles =   $('.dna-clone.book').toArray().map(elem => $(elem).find('h2').text());
      const actual =   { titles: Array.from(titles) };
      const expected = { titles: ['The DOM 2.0!', 'Styling CSS3', 'Howdy HTML5'] };
      assert.deepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Plugin call clone.dna("destroy")', () => {

   it('deletes a book from the DOM', () => {
      dna.getClones('book').last().last().dna('destroy');
      const titles =   $('.dna-clone.book').toArray().map(elem => $(elem).find('h2').text());
      const actual =   { titles: Array.from(titles) };
      const expected = { titles: ['The DOM 2.0!', 'Styling CSS3'] };
      assert.deepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Function dna.templateExists()', () => {

   it('identifies if a template is present after cloning', () => {
      const actual =   [dna.templateExists('book'), dna.templateExists('bogus')];
      const expected = [true, false];
      assert.deepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
describe('Function dna.info()', () => {

   it('reports the correct number of templates and clone instances', () => {
      const actual = JSON.parse(JSON.stringify(dna.info()));
      delete actual.store;
      delete actual.version;
      const expected = {
         clones:       2,
         initializers: [],
         names:        ['book'],
         panels:       [],
         subs:         0,
         templates:    1,
         };
      assert.deepStrictEqual(actual, expected);
      });

   });

////////////////////////////////////////////////////////////////////////////////////////////////////
});