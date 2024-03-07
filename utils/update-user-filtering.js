function filterUpdateFields(data, allowedFields) {
    const filteredData = {};
    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = data[key];
      }
    });
    return filteredData;
  }
  
  module.exports = filterUpdateFields;
  