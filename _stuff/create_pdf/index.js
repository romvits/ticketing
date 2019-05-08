import PDFDocument from 'pdfkit';
import fs from 'fs';

class OrderPDF {
	constructor(filename) {
		this.doc = new PDFDocument();

		console.log('hier');

		this.doc.pipe(fs.createWriteStream(filename));
		this.addTemplate();
		this.addHeader();
		this.addFooter();
		this.doc.end();
	}

	addTemplate() {

	}

	addHeader() {
		this.doc.text('Here is some vector graphics...', 100, 100);
	}

	addFooter() {

	}

}

const orderPDF = new OrderPDF('./output.pdf');

