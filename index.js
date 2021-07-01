const { readFile } = require('fs').promises;
const turf = require('@turf/turf');

const getStreets = (wardPolygon) => {
  return openJSONFile('./alleghenycounty_streetcenterlines202106.geojson')
  .then((features) => {
    return Promise.resolve(
      features.features.filter((f) => f.properties.RMUNI === "PITTSBURGH")
    );
  });

  return Promise.resolve([]);
};

const listStreets = (streets) => {
  console.log(streets);
}

const openJSONFile = (filename) => {
  return readFile(filename, { encoding: 'utf8' })
  .then((file) => Promise.resolve(JSON.parse(file)));
};

const openWardFile = () => {
  return openJSONFile('./Pittsburgh_Wards.geojson');
};

const selectOakland = (wards) => {
  const ward = wards.features.filter((ward) => { return ward.properties.ward === 4; })[0]

  return Promise.resolve(
    turf.multiPolygon(ward.geometry.coordinates, { name: 'ward' })
  );
};

const run = () => {
  openWardFile()
  .then(selectOakland)
  .then(getStreets)
  .then(listStreets);
};

run();
