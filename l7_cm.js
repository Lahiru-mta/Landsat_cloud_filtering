var Ratnapura = ee.FeatureCollection("projects/ee-research16ges868/assets/Ratnapura"),
    l7raw = ee.ImageCollection("LANDSAT/LE07/C02/T1");
var year = '2000';
var resolution = 30;

var ratnapura = Ratnapura;
var roi = ((ratnapura.geometry().bounds(100)).buffer(1000, 100)).bounds(100);

//Define a true color visualization for Landsat 7.
var trueColorVis = {min: 0, max: 0.3, bands: ["B3", "B2", "B1"]};

// SimpleComposite
var l7raw = l7raw.filterBounds (roi) ;
var composite = ee.Algorithms.Landsat.simpleComposite({
  collection: l7raw. filterDate( year+"-01-01", year+"-12-31"),
  asFloat: true
});
var img = composite.clip(roi);
Map.addLayer (img, trueColorVis, "Landsat Composite");
Map.centerObject (roi, 10);

var projection = img.select('B2').projection().getInfo();
Export.image.toDrive({
  image: img,
  description: 'l7_'+year,
  crs: projection.crs,
  scale: resolution,
  folder: 'ls7',
  region: roi
});