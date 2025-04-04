// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 * import { ThemeMode } from 'config';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

export default function LogoIcon() {
  const theme = useTheme();

  return (
    /**
     * if you want to use image instead of svg uncomment following, and comment out <svg> element.
     *
     * <img src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon} alt="Mantis" width="100" />
     *
     */
    <svg width="129" height="129" viewBox="0 0 129 129" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 59.697976,0.05602457 C 57.501502,0.01383051 55.178104,0.68112797 52.479759,2.4014343 65.124317,13.568612 75.925455,24.628961 79.932653,43.069962 84.919755,42.506504 89.903811,42.07351 94.220827,42.061539 88.967412,26.09073 80.273237,12.465629 68.910645,3.9598538 65.512289,1.4163502 62.58504,0.11168254 59.697976,0.05602457 Z M 47.834627,5.2429766 C 39.494338,6.361819 32.27834,8.6955583 26.475113,12.596994 18.08716,18.236091 12.402817,27.063545 10.114614,41.256598 8.3518355,52.190671 9.5817064,65.319041 10.51561,77.011074 c 2.996529,2.601255 6.4783,4.995738 9.543555,6.931498 4.957173,3.109058 10.939976,6.277364 15.705934,7.880672 1.370925,-5.096285 2.862124,-9.566868 4.503798,-14.208612 7.293873,-0.333963 14.319214,0.137661 20.993714,1.452492 2.316472,5.487984 3.916579,11.62531 4.697511,16.802083 7.511969,-0.02985 14.408169,-0.376134 21.181607,-1.329503 -2.145765,-1.164325 -4.301228,-2.832862 -5.838425,-4.469983 -3.986967,0.07213 -7.107648,-0.02912 -10.750981,-0.266329 C 65.947098,75.83686 64.072637,60.343334 63.077489,47.423535 67.076095,45.895338 71.430802,44.635856 75.019266,43.903324 71.165875,26.532102 60.910392,16.678269 47.834627,5.2429766 Z M 81.910479,9.0693038 C 89.70345,18.0757 95.669347,29.490945 99.572346,42.110913 c 2.948164,0.08127 5.894204,0.235849 8.835784,0.463519 C 105.7993,28.644709 91.438792,11.25941 81.910479,9.0693038 Z M 91.049156,47.55102 c -7.944554,0.298653 -15.751938,1.39833 -22.661993,3.691972 0.875153,11.308715 1.968404,22.387021 5.683236,33.345929 1.193841,0.05595 2.381591,0.08798 3.564627,0.09815 C 74.82334,78.415987 74.516009,69.708524 74.945551,64.257349 76.407651,54.221282 82.989039,49.104055 91.049156,47.55102 Z m -6.1028,7.956676 c -6.836618,5.808165 -6.507673,17.086359 -3.543566,25.176498 4.306489,9.889442 11.755094,9.538731 19.9995,9.881271 9.81018,-2.911324 13.5262,-6.834509 15.64248,-14.670359 2.36841,-8.769394 -4.99853,-22.21652 -10.95597,-24.895035 -6.735748,-2.316896 -15.404891,0.76239 -21.142444,4.507625 z M 4.4721161,62.97273 C -0.01450205,69.331789 -2.2805352,80.326904 4.2642738,86.088689 18.187201,98.347179 31.457502,109.49581 50.965839,120.1459 c 21.28774,11.62142 43.881843,11.93592 62.315771,0.56855 16.90782,-10.42597 17.57236,-19.48422 14.42342,-27.245199 -4.33524,-15.180701 -18.57934,2.114785 -30.54254,3.981928 -10.53704,2.214049 -20.666714,3.876391 -30.552514,3.818341 0.144102,1.49528 0.246912,2.80773 0.374114,4.34999 -11.158904,2.59197 -25.23702,1.65537 -33.062965,-3.4481 0.157957,-1.72359 0.40626,-3.603692 0.674515,-5.090594 C 29.04792,95.299765 22.820694,91.903442 17.553698,88.599877 13.981862,86.169782 10.385917,84.059571 7.3611211,81.200972 6.507583,80.416677 5.8330661,79.436082 5.6590331,78.626946 5.2616389,73.291278 4.7464676,67.786837 4.4721161,62.97273 Z M 43.788911,82.837495 c -1.79132,5.224356 -3.687675,11.627101 -4.450314,16.55342 6.186486,3.344855 15.325167,3.328995 22.235781,1.978845 C 60.985767,95.520896 59.953762,89.481725 57.778072,83.885417 52.667095,82.979329 48.399401,82.641492 43.788911,82.837495 Z"
        fill="gray"
      />
      <path
        d="m 96.463843,87.774039 c -3.489468,-0.282912 -5.268315,-0.739781 -7.396437,-1.899676 -2.738971,-1.492834 -4.806347,-4.224268 -6.008669,-7.938707 -0.809055,-2.499487 -1.24439,-5.431818 -1.234491,-8.315293 0.0173,-5.061477 1.247474,-8.658504 3.922108,-11.468928 1.672137,-1.757032 6.895888,-4.210199 10.723294,-5.035851 3.415559,-0.736808 6.897202,-0.549298 8.975282,0.483379 2.78807,1.385471 6.13446,5.9216 8.02837,10.882637 1.50087,3.931415 1.88016,7.60146 1.10769,10.717544 -0.48779,1.967677 -1.7529,4.791737 -2.80066,6.251856 -1.70093,2.370347 -4.74498,4.402338 -8.72803,5.826239 -2.1386,0.764527 -2.73321,0.809362 -6.588457,0.4968 z"
        fill="gray"
      />
      <path
        d="m 33.067325,17.624348 c 0.0029,-0.07009 0.01715,-0.08435 0.03635,-0.03635 0.01738,0.04343 0.01524,0.09533 -0.0047,0.115323 -0.01999,0.01999 -0.03421,-0.01554 -0.0316,-0.07897 z"
        fill="gray"
      />
      <path
        d="m 27.76775,25.264369 c -1.470776,-0.126763 -2.190192,-0.294755 -2.945286,-0.687759 -1.498966,-0.780168 -2.439432,-2.350778 -2.712635,-4.530191 -0.09172,-0.731651 -0.04372,-2.205944 0.08921,-2.74022 0.242022,-0.972727 0.654438,-1.724474 1.294624,-2.359826 0.408874,-0.405787 0.557205,-0.504587 1.329252,-0.885385 1.533966,-0.756601 2.663131,-1.056898 3.967696,-1.055191 0.957354,0.0013 1.447254,0.101455 2.05347,0.420013 1.283993,0.674719 2.690176,2.795543 3.193235,4.816079 0.191127,0.767662 0.191703,1.964584 0.0013,2.636571 -0.222418,0.784848 -0.806911,1.898877 -1.238677,2.360884 -0.728822,0.779871 -1.720319,1.381292 -2.962353,1.796903 -0.659379,0.220642 -1.316408,0.293056 -2.069809,0.228122 z m 1.955591,-0.868622 c 2.165164,-0.74658 3.153039,-1.749403 3.704902,-3.76096 0.113379,-0.413271 0.126226,-0.575734 0.09721,-1.229381 -0.04232,-0.953463 -0.210109,-1.598959 -0.662948,-2.550377 -0.444667,-0.934249 -0.922822,-1.646313 -1.482524,-2.207759 -0.811506,-0.814035 -1.252546,-0.983692 -2.559287,-0.984497 -1.273606,-7.84e-4 -2.298519,0.259746 -3.686286,0.93704 -1.106602,0.540073 -1.710176,1.1726 -2.095318,2.195829 -0.712113,1.89191 -0.306212,4.799454 0.873375,6.256148 0.771442,0.952667 1.807296,1.395808 3.554438,1.520594 1.378182,0.09843 1.482346,0.09028 2.256434,-0.176637 z"
        fill="gray"
      />
      <path
        d="m 27.948255,25.196622 c -0.567702,-0.03112 -1.433051,-0.148547 -1.907898,-0.258908 -2.217156,-0.515299 -3.627227,-2.39263 -3.869052,-5.151154 -0.07709,-0.879401 0.0091,-2.150582 0.186209,-2.745668 0.262418,-0.881811 0.808722,-1.74012 1.444148,-2.268926 0.597724,-0.497431 2.118845,-1.182617 3.304235,-1.488387 0.563681,-0.1454 0.742005,-0.163173 1.654633,-0.164908 1.194427,-0.0023 1.600106,0.09031 2.258816,0.515483 1.292227,0.834086 2.669456,3.106913 3.001844,4.953912 0.0899,0.499534 0.07824,1.61377 -0.02176,2.079804 -0.165413,0.770903 -0.76575,1.955986 -1.281382,2.529493 -0.718894,0.799583 -2.115329,1.583485 -3.355835,1.88383 -0.38206,0.0925 -0.964606,0.140059 -1.413959,0.115429 z m 1.835139,-0.736435 c 1.986205,-0.716027 3.002357,-1.665317 3.585219,-3.349316 0.197471,-0.570529 0.205336,-0.627079 0.203885,-1.465865 -0.0017,-0.995578 -0.09558,-1.50707 -0.428888,-2.337371 -0.432457,-1.077279 -0.960579,-1.914176 -1.667932,-2.643113 -0.874431,-0.901114 -1.269955,-1.060358 -2.624896,-1.056826 -1.365642,0.0036 -2.233058,0.21167 -3.580024,0.858915 -1.159557,0.557191 -1.689653,1.032901 -2.127836,1.909524 -1.005725,2.012047 -0.498767,5.581822 1.00005,7.041908 0.918068,0.894343 2.360169,1.304824 4.406968,1.254405 0.603736,-0.01487 0.760964,-0.04193 1.233454,-0.212261 z"
        fill="gray"
      />
      <defs>
        <linearGradient id="paint0_linear" x1="25.0225" y1="49.3259" x2="11.4189" y2="62.9295" gradientUnits="userSpaceOnUse">
          <stop stopColor={theme.palette.primary.darker} />
          <stop offset="0.9637" stopColor={theme.palette.primary.dark} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="103.5" y1="49.5" x2="114.5" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor={theme.palette.primary.darker} />
          <stop offset="1" stopColor={theme.palette.primary.dark} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
