package com.application.based.util;

import com.application.based.entity.Book;
import com.application.based.entity.Order;
import com.application.based.entity.OrderItem;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.IOException;

@Component
public class PDFGenerator {

    private void addTableCell(PdfPTable table, String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorder(Rectangle.NO_BORDER);
        table.addCell(cell);
    }

    private void addTableHeader(PdfPTable table, String[] headers, Font font) {
        for (String header : headers) {
            PdfPCell headerCell = new PdfPCell();
            headerCell.setBackgroundColor(Color.LIGHT_GRAY);
            headerCell.setPhrase(new Phrase(header, font));
            table.addCell(headerCell);
        }
    }
    public void generate(Order order, HttpServletResponse response) throws DocumentException, IOException{
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.TIMES_ROMAN, 20, Font.BOLD);
        Font fieldFont = FontFactory.getFont(FontFactory.TIMES_ROMAN, 12);
        Font valueFont = FontFactory.getFont(FontFactory.TIMES_ROMAN, 12);
        Paragraph title = new Paragraph("Receipt of Order", titleFont);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);

        PdfPTable orderInfoTable = new PdfPTable(2);
        orderInfoTable.setWidthPercentage(100);
        orderInfoTable.setSpacingBefore(10f);
        orderInfoTable.setSpacingAfter(10f);

        addTableCell(orderInfoTable, "Order ID:", fieldFont);
        addTableCell(orderInfoTable, String.valueOf(order.getId()), valueFont);
        addTableCell(orderInfoTable, "Username:", fieldFont);
        addTableCell(orderInfoTable, order.getUser().getUsername(), valueFont);
        addTableCell(orderInfoTable, "Email:", fieldFont);
        addTableCell(orderInfoTable, order.getUser().getEmail(), valueFont);
        addTableCell(orderInfoTable, "Total Price:", fieldFont);
        addTableCell(orderInfoTable, String.format("$%.2f", order.getTotalPrice()), valueFont);
        addTableCell(orderInfoTable, "Order Date:", fieldFont);
        addTableCell(orderInfoTable, order.getCreatedDate().toString(), valueFont);

        document.add(orderInfoTable);

        document.add(new Paragraph("Book Details:", fieldFont));
        document.add(Chunk.NEWLINE);

        PdfPTable bookTable = new PdfPTable(4);
        bookTable.setWidthPercentage(100);
        bookTable.setWidths(new int[]{4, 3, 3, 2});

        addTableHeader(bookTable, new String[]{"Title", "ISBN", "Author", "Quantity"}, fieldFont);

        for (OrderItem item : order.getOrderItems()) {
            Book book = item.getBook();
            bookTable.addCell(new PdfPCell(new Phrase(book.getBookName(), valueFont)));
            bookTable.addCell(new PdfPCell(new Phrase(book.getIsbn(), valueFont)));
            bookTable.addCell(new PdfPCell(new Phrase(book.getAuthorName(), valueFont)));
            bookTable.addCell(new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), valueFont)));
        }

        document.add(bookTable);
        document.close();
    }
}
