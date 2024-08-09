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

async function getUrlsForPath(path) {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT URL FROM MST_DASHBOARD_URLS WHERE DASHBOARD_ID = (SELECT DASHBOARD_ID FROM MST_DASHBOARDS WHERE DASHBOARD_NAME = :path and USE_YN ='Y') and USE_YN ='Y' ORDER BY ORDER_NUM`,
      [path]
    );
    
    return result.rows.map(row => row[0]); // 데이터베이스 열 이름에 따라 조정 필요
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

