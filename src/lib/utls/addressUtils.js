export let placeAddressCompoponent = {
  ZIP_CODE: "postal_code",
  COUNTRY: "country",
  STATE: "administrative_area_level_1",
  CITY: "locality",
  ADDRESS: "route",
};

export function getAddressComponent(address_components, key) {
  var value = "";
  var postalCodeType = address_components.filter((aComp) =>
    aComp.types.some((typesItem) => typesItem === key)
  );
  if (postalCodeType != null && postalCodeType.length > 0)
    value = postalCodeType[0].long_name;
  return value;
}
