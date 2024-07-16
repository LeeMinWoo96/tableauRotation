import express from 'express';

const router = express.Router();

const urls = [
    'http://121.254.201.142/views/POS_NEW_2_17158490567760/POS?:showVizHome=no&:embed=true',
    'http://121.254.201.142/views/_BR_/BR?:showVizHome=no&:embed=true',
    'http://121.254.201.142/views/_DD_/DD?:showVizHome=no&:embed=true',
    'http://121.254.201.142/views/2/BR?:showVizHome=no&:embed=true'
];

let currentIndex = 0;

router.get('/rotate', (req, res) => {
    currentIndex = (currentIndex + 1) % urls.length;
    res.json({ url: urls[currentIndex] });
});

export default router;
