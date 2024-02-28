<?php
namespace WP3D;
class Plugin {
    
    //https://3dviewer.net/info/index.html#supported_file_formats
    public static $mimes = [
        'stl' => 'application/octet-stream',
        'wrl' => 'model/vrml',
        'glb' => 'model/gltf-binary',
        'gltf' => 'model/gltf-json',
        'obj' => 'text/plain',
        'zip' => 'application/zip',
        'usdz' => 'model/vnd.usdz+zip',
        'mp4' => 'video/mp4',
        
        'ttf' => 'application/x-font-ttf', // font
        'dae' => 'model/dae',
        'fbx' => 'model/fbx',

        //'jpg' => 'image/jpeg',
        //'png' => 'image/png',
        'hdr' => 'image/vnd.radiance',
        'exr' => 'image/x-exr',
        'json' => 'application/json'
    ];
    //Media Mime
    public static $mimes3D = [
        'stl'   => 'application/octet-stream',
        'wrl'   => 'model/vrml',
        'glb'   => 'model/gltf-binary',
        'gltf'  => 'model/gltf-json',
        'obj'   => 'text/plain',
        'zip'   => 'application/zip',
        'usdz'  => 'model/vnd.usdz+zip',
        'dae'   => 'model/dae',
        'fbx'   => 'model/fbx',
    ];
    public static $mimesImage = [
        'jpg'   => 'image/jpeg',
        'png'   => 'image/png',
        'gif'   => 'image/gif',
        'webp'  => 'image/webp'
    ];
    public static $mimesHdr = [
        'hdr' => 'image/vnd.radiance',
    ];
    public static $mimesExr = [
        'exr' => 'image/x-exr'
    ];
    public static $mimesFont = [
        'ttf' => 'application/x-font-ttf', // font
    ];
    public static $mimesVideo = [
        'mp4' => 'video/mp4'
    ];
    public static $mimesJson = [
        'json' => 'application/json'
    ];
    
    /**
     * Instance.
     *
     * Holds the plugin instance.
     *
     * @since 1.0.1
     * @access public
     * @static
     *
     * @var Plugin
     */
    public static $instance = null;

    /**
     * Constructor
     *
     * @since 1.0.1
     *
     * @access public
     */
    public function __construct() {
        
        //$plugin_class_name = get_class($this);

        //require_once(WP3D_MODELIMPORT_PLUGIN_DIR . 'core' . DIRECTORY_SEPARATOR . 'helper.php');

        $this->setup_hooks();
        
        $this->handle_import_file();

        //$this->licenses_manager = new License();
                  
    }

    /**
     * Instance.
     *
     * Ensures only one instance of the plugin class is loaded or can be loaded.
     *
     * @since 1.0.0
     * @access public
     * @static
     *
     * @return Plugin An instance of the class.
     */
    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();

            /**
             * on loaded.
             *
             * Fires when was fully loaded and instantiated.
             *
             * @since 1.0.1
             */
            do_action('wp3d/instance', self::$instance);
        }

        return self::$instance;
    }

    public function setup_hooks() {
        
        add_filter( 'upload_mimes', [$this, 'add_3d_mime_types'] );
        if ( version_compare( get_bloginfo('version'), '5.1') >= 0) {
            add_filter( 'wp_check_filetype_and_ext', [$this, '_add_3d_mime_types'], 10, 5);
        } else {
            add_filter( 'wp_check_filetype_and_ext', [$this, '_add_3d_mime_types'], 10, 4);
        }
  
    }
    
    public function add_3d_mime_types( $mimes ) {
        foreach (self::$mimes as $mkey => $mime) {
            $mimes[$mkey] = $mime;
        }
        //var_dump($mimes); die();
        return $mimes;
    }
    
    function _add_3d_mime_types($attr, $file, $filename, $mimes, $real_mime = null){
        $proper_filename = '';
        if (!empty($attr['ext'])) {
            $ext = $attr['ext'];
        } else {
            $tmp = explode(".", $filename);
            if (count($tmp) == 1){
                return $attr;
            }
            $ext  = array_pop($tmp);
            //$proper_filename = $filename; //implode('.', $tmp);
        }
        //var_dump($ext); var_dump($attr); var_dump($file); var_dump($filename); var_dump($mime); var_dump($real_mime); die();
        switch ($ext){
            case 'glb':
            case 'gltf':
                $type = self::$mimes['glb'];//'model/gltf-binary';
                return compact('ext', 'type', 'proper_filename');
            case 'usdz':
            default:
                if (isset(self::$mimes[$ext])) {
                    $type = self::$mimes[$ext];
                    return compact('ext', 'type', 'proper_filename');
                }
        }
        return $attr;
    }
    
    
    protected function handle_import_file() {

        //var_dump($settings['source']);
        if (!empty($_GET['action']) && $_GET['action'] == 'wp3d') {
            
            if (!empty($_GET['url'])) {
                $url = sanitize_url($_GET['url']);
                
                $media_id = attachment_url_to_postid($url);
                //var_dump($media_id); die();
                if ($media_id) {
                    $file_path = get_attached_file($media_id);
                    $file_path = str_replace('/', DIRECTORY_SEPARATOR, $file_path);
                    //var_dump($file_path);
                    if (file_exists($file_path)) {
                        $file_info = pathinfo($file_path); //[dirname],[basename],[extension],[filename]
                        $wp_upload_dir = wp_upload_dir();
                        switch ($file_info['extension']) {
                            case 'zip':
                                //var_dump($wp_upload_dir); die();
                                $folder_3d = $wp_upload_dir['basedir'] .DIRECTORY_SEPARATOR.'wp3d' .DIRECTORY_SEPARATOR. $media_id;
                                $folder_3d = str_replace('/', DIRECTORY_SEPARATOR, $folder_3d);
                                if (!is_dir($folder_3d)) {
                                    // extract in /uploads/wp3d/ID
                                    include_once(ABSPATH.DIRECTORY_SEPARATOR.'wp-admin'.DIRECTORY_SEPARATOR.'includes'.DIRECTORY_SEPARATOR.'file.php');
                                    $unzip = unzip_file($file_path, $folder_3d);
                                    $zip = new \ZipArchive;
                                    if ($zip->open($file_path) === TRUE) {
                                        $zip->extractTo($folder_3d);
                                        $zip->close();
                                    }
                                    //var_dump($zip);
                                }
                                // search inside the folder a valid file
                                $extensions = !empty($_GET['type']) ? $_GET['type'] : Utils::implode(array_filter(array_keys(self::$types)), '|');
                                $file = $this->rsearch($folder_3d, "/^.*\.(" . $extensions . ")$/");
                                if (!empty($file)) {
                                    $file_path = reset($file);
                                    $file_info = pathinfo($file_path);
                                }
                                break;
                        }
                        //var_dump($file_info);
                        list($pre, $folder) = explode('uploads', $file_info['dirname'], 2);
                        $folder = str_replace(DIRECTORY_SEPARATOR, '/', $folder);
                        echo $wp_upload_dir['baseurl'] .$folder.'/'.$file_info['filename'].'.'.$file_info['extension'];
                        die();
                    }
                }
                
                echo $url;
                die();
            }
        }
    }

    public function rsearch($folder, $pattern) {
        $dir = new \RecursiveDirectoryIterator($folder);
        $ite = new \RecursiveIteratorIterator($dir);
        $files = new \RegexIterator($ite, $pattern, \RegexIterator::GET_MATCH);
        $fileList = array();
        foreach ($files as $file) {
            $fileList[] = $file[0];
        }
        return $fileList;
    }
    
}
