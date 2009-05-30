package namnam.export;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.logging.Level;
import java.util.logging.Logger;
import namnam.model.Mensa;

/**
 *
 * @author fake
 */
public abstract class NamNamExporter {

    private static Logger logger = Logger.getLogger(NamNamExporter.class.getName());

    protected Mensa mensa = null;
    protected String path = null;

    // returns the filename of the file that will be created
    public abstract String getFileName();
    // do the actual export
    protected abstract void doExport(OutputStream os) throws NamNamExportException;

    public NamNamExporter() {
    }

    public NamNamExporter(Mensa mensa) {
        this.mensa = mensa;
    }

    public void export(Mensa m) throws NamNamExportException {
        this.setMensa(m);
        this.export();
    }

    public void export() throws NamNamExportException {
        if(mensa == null) throw new NamNamExportException("Set a mensa first!");

        try {
            FileOutputStream fos = null;
            if(path == null || path.trim().equals(""))
                fos = new FileOutputStream(this.getFileName());
            else {
                if(!path.endsWith(File.pathSeparator)) path = path + File.pathSeparator;
                fos = new FileOutputStream(path+this.getFileName());
            }

            doExport(fos);
            
            fos.close();
        } catch (FileNotFoundException fnfe) {
            logger.log(Level.SEVERE,"File not found while trying to open it for output", fnfe);
            throw new NamNamExportException("File not found while trying to open it for output",fnfe);
        } catch (IOException ioex) {
            logger.log(Level.SEVERE,"Error flushing/closing file after output", ioex);
            throw new NamNamExportException("Error flushing/closing file after output",ioex);
        }
        
    }

    public Mensa getMensa() {
        return mensa;
    }

    public void setMensa(Mensa mensa) {
        this.mensa = mensa;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

}
