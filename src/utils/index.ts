import { graphic } from "echarts/core";

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

export const formatStatus = (status: 0 | 1 | 2) => {
  let t = "";
  switch (status) {
    case 0:
      t = "待处理";
      break;
    case 1:
      t = "处理中";
      break;
    case 2:
      t = "已完成";
      break;
  }
  return t;
};
export const formatDate = (date: string) => {
  const t = new Date(Number(date));
  return `${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日`;
};
export const paginate = (array, pageSize, pageNumber) => {
  return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};
export const colorRandom = () =>
  "rgb(" +
  [
    Math.round(Math.random() * 127) + 110,
    Math.round(Math.random() * 127) + 110,
    Math.round(Math.random() * 127) + 110,
  ].join(",") +
  ")";

export const getShopChatOptions = (list, date) => {
  const opt = {
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      type: "value",
    },
    grid: {
      top: "2%",
      left: "2%",
      right: "3%",
      bottom: "2%",
      containLabel: true,
    },
    color: ["#009688", "#f44336"],
    series: [
      {
        type: "line",
        areaStyle: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: "rgba(0, 150, 136,0.8)",
            },
            {
              offset: 1,
              color: "rgba(0, 150, 136,0.2)",
            },
          ]),
        },
        smooth: true,
        data: [],
      },
      // {
      //   type: "line",
      //   smooth: true,
      //   data: [220, 122, 191, 234, 190, 130, 310],
      // },
    ],
    tooltip: {
      show: true,
    },
  };
  if (!list?.length || !date) {
    return opt;
  }
  const dt = getAllDatesBetween(date[0], date[1]);
  opt.xAxis.data = dt;
  const n = new Array(dt.length).fill(0);
  for (let i = 0; i < list.length; i++) {
    const p = list[i].date;
    if (!p) continue;
    const idx = dt.findIndex((item) => isSameDay(item, Number(p)));
    if (idx != -1) {
      n[idx] += 1;
    }
  }
  opt.series[0].data = n;
  return opt;
};
// 获取两个日期之间的所有日期
function getAllDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate.getTime());

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates.map((date) => date.toISOString().slice(0, 10));
}
// 判断是否为同一天
function isSameDay(timestamp1, timestamp2) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

const secretKey = "sjl_857_token";
export const generateToken = () => {
  const today = new Date();
  const dateString = today.toISOString().slice(0, 10); // 获取YYYY-MM-DD格式的日期
  return btoa(`${dateString}-${secretKey}`); // Base64编码
};
