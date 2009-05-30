package namnam.export.json;

import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import namnam.export.NamNamExportException;
import namnam.export.NamNamExporter;
import namnam.model.Mensaessen;
import namnam.model.Tagesmenue;

/**
 * module to export a mensa object to java serialised xml
 * @author fake
 */
public class NamNamJSONExporter extends NamNamExporter {

     private Logger logger = Logger.getLogger(NamNamJSONExporter.class.getName());

    protected void doExport(OutputStream os) throws NamNamExportException{
        try {
            JSONObject jmensa = new JSONObject();
            jmensa.put("name",mensa.getName());
            jmensa.put("firstDate", "Date("+mensa.getFirstDate().getTime()+")");
            jmensa.put("lastDate", "Date("+mensa.getLastDate().getTime()+")");

            Iterator<Tagesmenue> dMit = mensa.getDayMenues().iterator();
            JSONArray dayMenueAr = new JSONArray();

            while(dMit.hasNext()) {
                Tagesmenue t = dMit.next();
                JSONObject jtm = new JSONObject();
                jtm.put("day", "Date("+t.getTag().getTime()+")");

                JSONArray foodAr = new JSONArray();
                Iterator<Mensaessen> eIt = t.getMenues().iterator();
                while(eIt.hasNext()) {
                    Mensaessen m = eIt.next();
                    JSONObject jm = new JSONObject();
                    jm.put("description", m.getBeschreibung());
                    jm.put("studentPrice", m.getStudentenPreis().getCents());
                    jm.put("normalPrice", m.getPreis().getCents());
                    foodAr.put(jm);
                }
                jtm.put("menues", foodAr);
                dayMenueAr.put(jtm);
            }
            jmensa.put("dayMenues", dayMenueAr);

            Writer w = new OutputStreamWriter(os);
            jmensa.write(w);
            w.flush();
            w.close();
        } catch  (JSONException jsex) {
            logger.log(Level.SEVERE, "JSON Exception while exporting", jsex);
            throw new NamNamExportException("JSON error while exporting",jsex);
        } catch  (IOException ioex) {
            logger.log(Level.SEVERE, "IO Exception while exporting", ioex);
            throw new NamNamExportException("IO error while exporting",ioex);
        }

    }

    @Override
    public String getFileName() {
        return mensa.getName()+".json";
    }

}
