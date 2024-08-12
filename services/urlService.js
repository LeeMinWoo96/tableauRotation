// // services/urlService.js
import oracledb from 'oracledb';
import dbConfig from '../config/dbConfig.js';



async function getPaths() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      "SELECT DASHBOARD_NAME FROM MST_DASHBOARDS WHERE USE_YN ='Y'"
    );
    // console.debug(result.rows.map(row => row[0]));
    return result.rows.map(row => row[0]); 
  } catch (err) {
    console.error(err);
    return [];
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

function transformUrl(url, tableauServerUrl) {
  const urlParts = url.split('/#/views/');  // '/#/views/'을 기준으로 분리
  if (urlParts.length > 1) {
    const viewPath = urlParts[1];  // '#/views/' 이후의 경로를 가져옴
    return `${tableauServerUrl}/trusted/:token/views/${viewPath}?:embed=yes&:showVizHome=no&:toolbar=no`;
  } else {
    // 변환 실패시 원본 URL 반환
    return url;
  }
}

export { transformUrl };


async function getUrlsForPath(path,tableauServerUrl) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT URL FROM MST_DASHBOARD_URLS WHERE DASHBOARD_ID = (SELECT DASHBOARD_ID FROM MST_DASHBOARDS WHERE DASHBOARD_NAME = :path and USE_YN ='Y') and USE_YN ='Y' ORDER BY ORDER_NUM`,
      [path]
    );
    const transformedUrls = result.rows.map(row => transformUrl(row[0], tableauServerUrl));
    return transformedUrls;
    
  } catch (err) {
    console.error(err);
    return [];
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

// export default getUrlsForPath ;

// const dummyData = {
//   paths: ['ALL', 'BR', 'DD'],
//   ALL: [
//     'http://10.0.50.185/trusted/:token/views/POS_NEW_2_17158490567760/POS?:embed=yes&:showVizHome=no&:toolbar=no',
//     'http://10.0.50.185/trusted/:token/views/_BR_/BR?:embed=yes&:showVizHome=no&:toolbar=no',
//     'http://10.0.50.185/trusted/:token/views/_DD_/DD?:embed=yes&:showVizHome=no&:toolbar=no',
//     'http://10.0.50.185/trusted/:token/views/2/BR?:embed=yes&:showVizHome=no&:toolbar=no'
//   ],
//   BR: [
//     'http://10.0.50.185/trusted/:token/views/POS_NEW_2_17158490567760/POS?:embed=yes&:showVizHome=no&:toolbar=no',
//     'http://10.0.50.185/trusted/:token/views/_BR_/BR?:embed=yes&:showVizHome=no&:toolbar=no',
//     'http://10.0.50.185/trusted/:token/views/2/BR?:embed=yes&:showVizHome=no&:toolbar=no'
//   ],
//   DD: [
//     'http://10.0.50.185/trusted/:token/views/POS_NEW_2_17158490567760/POS?:embed=yes&:showVizHome=no&:toolbar=no',
//     'http://10.0.50.185/trusted/:token/views/_DD_/DD?:embed=yes&:showVizHome=no&:toolbar=no',
//     'http://10.0.50.185/trusted/:token/views/2/BR?:embed=yes&:showVizHome=no&:toolbar=no'
//   ]
// };
// const getPaths = async () => {
//   return dummyData.paths;
// }

// const getUrlsForPath = async (path) => {
//   console.log("b");
//   return dummyData[path] || [];
// }

export { getPaths, getUrlsForPath };

