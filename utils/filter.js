class Filter {
  constructor(list) {
    this.list = list;
  }
  // 过滤匹配字符筛选 
  doFilter(str) {
    let array = [];
    if (str != '') {
      for (let item of this.list) {
        if (item.orzName.includes(str)) {
          array.push(item);
        }
      }
    }
    return array;
  }
}
export { Filter }