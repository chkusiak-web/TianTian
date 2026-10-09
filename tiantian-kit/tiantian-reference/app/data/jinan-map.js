/* Jinan map layout — base art + positions.
   Everything is in % of the base image (x from the left, y from the top), so markers stay locked to the art
   at any window size and zoom.
   - image: the base map (shown as-is). width/height: its pixel size (@2x, displayed at half size for Retina).
   - spots: center of each district's clearing (from jinan-map-spots.json).
   - icons: drop in a final marker icon per district id (PNG or SVG path in app/img/), e.g. baotu: 'img/icons/baotu.png'.
            Districts without an icon use the placeholder seal.
   - labels: move a district's name tag if it crowds a neighbour.
   - quests: position of each quest marker when zoomed into a district. Tweak freely.
   - patchRadius: radius of the gray "locked" patch, % of map width. zoom: district zoom level. */
window.JINAN_MAP = {
  image: 'img/jinan-base-map@2x.png', width: 3172, height: 1984,
  patchRadius: 6, zoom: 2.5,
  spots: {
    baotu: [39.6, 60.3],
    furong: [47.0, 50.4],
    daming: [50.4, 40.1],
    quancheng: [49.1, 67.7],
    qianfo: [56.7, 83.5],
    west: [10.1, 39.1],
    qushuiting: [56.4, 58.3],
    shanda: [90.8, 50.4],
    kuanhouli: [73.8, 46.6],
    hospital: [25.9, 48.4]
  },
  icons: {},
  // Where a district's name tag sits relative to its seal: 'below' (default), 'above', 'left' or 'right'.
  labels: { daming: 'above', qushuiting: 'right' },
  quests: {
    'baotu-1': [39.6, 52.9],
    'baotu-2': [44.0, 58.0],
    'baotu-3': [42.3, 66.2],
    'baotu-4': [36.9, 66.2],
    'baotu-5': [35.2, 58.0],
    'furong-1': [47.0, 43.0],
    'furong-2': [51.4, 48.1],
    'furong-3': [49.7, 56.3],
    'furong-4': [44.3, 56.3],
    'furong-5': [42.6, 48.1],
    'daming-1': [50.4, 32.7],
    'daming-2': [54.8, 37.8],
    'daming-3': [53.1, 46.0],
    'daming-4': [47.7, 46.0],
    'daming-5': [46.0, 37.8],
    'quancheng-1': [49.1, 60.3],
    'quancheng-2': [53.5, 65.4],
    'quancheng-3': [51.8, 73.6],
    'quancheng-4': [46.4, 73.6],
    'quancheng-5': [44.7, 65.4],
    'qianfo-1': [56.7, 76.1],
    'qianfo-2': [61.1, 81.2],
    'qianfo-3': [59.4, 89.4],
    'qianfo-4': [54.0, 89.4],
    'qianfo-5': [52.3, 81.2],
    'west-1': [10.1, 31.7],
    'west-2': [14.5, 36.8],
    'west-3': [12.8, 45.0],
    'west-4': [7.4, 45.0],
    'west-5': [5.7, 36.8],
    'qushuiting-1': [56.4, 50.9],
    'qushuiting-2': [60.8, 56.0],
    'qushuiting-3': [59.1, 64.2],
    'qushuiting-4': [53.7, 64.2],
    'qushuiting-5': [52.0, 56.0],
    'shanda-1': [90.8, 43.0],
    'shanda-2': [95.2, 48.1],
    'shanda-3': [93.5, 56.3],
    'shanda-4': [88.1, 56.3],
    'shanda-5': [86.4, 48.1],
    'kuanhouli-1': [73.8, 39.2],
    'kuanhouli-2': [78.2, 44.3],
    'kuanhouli-3': [76.5, 52.5],
    'kuanhouli-4': [71.1, 52.5],
    'kuanhouli-5': [69.4, 44.3],
    'hospital-1': [25.9, 41.0],
    'hospital-2': [30.3, 46.1],
    'hospital-3': [28.6, 54.3],
    'hospital-4': [23.2, 54.3],
    'hospital-5': [21.5, 46.1]
  }
};
