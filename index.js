const { readFile } = require('fs').promises;

const getStreets = (ward) => {
  return Promise.resolve([]);
};

const listStreets = (streets) => {
  console.log(streets);
}

const openWardFile = () => {
  return readFile('./Pittsburgh_Wards.geojson', { encoding: 'utf8' })
  .then((file) => Promise.resolve(JSON.parse(file)));
};

const selectOakland = (wards) => {
  return Promise.resolve(
    wards.features.filter((ward) => { return ward.properties.ward === 4; })[0]
  );
};

const run = () => {
  openWardFile()
  .then(selectOakland)
  .then(getStreets)
  .then(listStreets);
};

run();
