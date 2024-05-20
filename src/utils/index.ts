export const setProperty = (
  prop: string,
  val: any,
  dom = document.documentElement
) => {
  dom.style.setProperty(prop, val);
};

export const mix = (
  color1: string,
  color2: string,
  weight: number = 0.5
): string => {
  let color = "#";
  for (let i = 0; i <= 2; i++) {
    const c1 = parseInt(color1.substring(1 + i * 2, 3 + i * 2), 16);
    const c2 = parseInt(color2.substring(1 + i * 2, 3 + i * 2), 16);
    const c = Math.round(c1 * weight + c2 * (1 - weight));
    color += c.toString(16).padStart(2, "0");
  }
  return color;
};

export const formatSort = (list) => {
  const sort1 = [];
  const sort2 = [];
  const res = [];
  for (let i = 0; i < list.length; i++) {
    const t = list[i];
    if (t.isDelete === 1) continue;
    if (t.level1 === 0) {
      // 二级分类
      sort2.push(t);
    } else if (t.level2 === 0) {
      // 一级分类
      sort1.push(t);
    }
  }
  for (let i = 0; i < sort1.length; i++) {
    const t = sort1[i];
    const tl = sort2.filter((item) => item.level2 === t.id);
    res.push({
      s1: t,
      s2: tl,
    });
  }
  return res;
};

export const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};
