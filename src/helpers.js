function contains(string, value) {
  string = string || "";
  value = value || "";
  return string.toLowerCase().indexOf(value.toLowerCase()) != -1;
}

export { contains };
