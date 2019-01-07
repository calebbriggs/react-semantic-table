function contains(string, value) {
  string = string || "";
  value = value || "";
  string = string + "";
  return string.toLowerCase().indexOf(value.toLowerCase()) != -1;
}

export { contains };
