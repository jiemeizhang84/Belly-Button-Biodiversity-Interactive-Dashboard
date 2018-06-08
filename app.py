# import necessary libraries
import numpy as np
import pandas as pd

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session, load_only
from sqlalchemy import create_engine, func
import sqlalchemy

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database Setup
#################################################

engine = create_engine("sqlite:///DataSets/belly_button_biodiversity.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables ['otu', 'samples', 'samples_metadata']
Base.prepare(engine, reflect=True)

Otu = Base.classes.otu
Samples = Base.classes.samples
Samples_metadata = Base.classes.samples_metadata

session = Session(engine)


#################################################
# Flask Routes
#################################################


@app.route("/")
def home():
    return render_template("index.html")

@app.route('/names')
def names():
    """List of sample names"""
    sample_name = Samples.__table__.columns.keys()[1:]
    return jsonify(sample_name)
 

@app.route('/otu')
def otu():
    """Returns a list of OTU descriptions"""
    results = session.query(Otu.lowest_taxonomic_unit_found).all()
    all_results = list(np.ravel(results))
    return jsonify(all_results)

@app.route('/metadata/<sample>')
def metadata(sample):
    """MetaData for a given sample."""
    result = session.query(Samples_metadata).filter(Samples_metadata.SAMPLEID == sample[3:]).first()
    sample_dict = {}
    sample_dict["AGE"] = result.AGE
    sample_dict["BBTYPE"] = result.BBTYPE
    sample_dict["ETHNICITY"] = result.ETHNICITY
    sample_dict["GENDER"] = result.GENDER
    sample_dict["LOCATION"] = result.LOCATION
    sample_dict["SAMPLEID"] = result.SAMPLEID       
    return jsonify(sample_dict)

@app.route('/wfreq/<sample>')
def wfreq(sample):
    """Weekly Washing Frequency as a number"""
    result = session.query(Samples_metadata.WFREQ).filter(Samples_metadata.SAMPLEID == sample[3:]).first()[0]
    return jsonify(result)

@app.route('/samples/<sample>')
def samples(sample):
    """OTU IDs and Sample Values for a given sample"""
    df = pd.read_sql(session.query(Samples).statement, engine)
    df = df[["otu_id",sample]]
    df = df.sort_values(by=sample, ascending=False)

    samples_dict = {}
    samples_dict["otu_ids"] = df['otu_id'].tolist()
    samples_dict["sample_values"] = df[sample].tolist()
    return jsonify([samples_dict])



if __name__ == "__main__":
    app.run()