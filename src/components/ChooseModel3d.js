import { __ } from '@wordpress/i18n';
import { PanelRow, Icon, Button } from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { useState, useEffect, useRef, Fragment } from '@wordpress/element';

function ChooseModel3d(prop) {
  const [mediaId, setMediaId] = useState(0);
  const [mediaUrl, setMediaUrl] = useState('');
  const [media, setMedia] = useState({"id":0, "url":"", "alt":"", "title":""});
  
  useEffect(() => {
      
  },[]);

  const removeMedia = () => {
		prop.onRemove()
    setMedia({"id":0, "url":"", "alt":"", "title":""})
	}
  const onSelectMedia = (m) => {
		prop.onAdd(m)
    setMedia({"id":m.id, "url":m.url, "alt":m.alt, "title":m.title})
    console.log('media_data',m.id,m.url)
	}
  /*
    $mime_types['stl']  = 'application/octet-stream';
    $mime_types['wrl']  = 'model/vrml';
    $mime_types['glb']  = 'model/gltf-binary';
    $mime_types['gltf']  = 'model/gltf-json';
    $mime_types['obj']  = 'text/plain';
    $mime_types['zip']  = 'application/zip';
    $mime_types['dae']  = 'model/dae';
    $mime_types['fbx']  = 'model/fbx';
  */
  //let allowedTipe = prop.mimetype; //['model/gltf-binary']
  let allowedTipe = [
    'model/vrml',
    'model/gltf-binary',
    'model/gltf-json',
    'application/octet-stream',
    'text/plain',
    'application/zip',
    'model/dae',
    'model/fbx'
  ]
  return (
      <>
      <div className="editor-post-image-texture">
        <h3><Icon icon="format-image" /> { prop.label ? __(prop.label, 'wp3d-blocks') : __('Image', 'wp3d-blocks')}</h3>
        <MediaUploadCheck>
          <MediaUpload
            onSelect={onSelectMedia}
            value={prop.value.id}
            allowedTypes={allowedTipe}
            multiple={false}
            render={({open}) => (
              <Button 
                className={prop.value.id == 0 ? 'editor-post-featured-image__toggle' : 'editor-post-featured-image__preview edit-post-post-schedule__toggle is-tertiary'}
                onClick={open}
              >
                { ! prop.value.id ? (
                  
                  <div>
                  { prop.chooselabel ? __(prop.chooselabel + ' ' + prop.mimetype, 'wp3d-blocks') : __('Choose an image', 'wp3d-blocks')}
                  </div>
                  
                  ) : (
                  
                  
                 <p className="">{ prop.value.url }</p>
                  )
                }
              </Button>
            )}
          />
        </MediaUploadCheck>
        {prop.value.id != 0 && 
          <PanelRow>
            <MediaUploadCheck>
              <MediaUpload
                title={__('Replace image', 'wp3d-blocks')}
                value={prop.value.id}
                onSelect={onSelectMedia}
                allowedTypes={allowedTipe}
                render={({open}) => (

                  <Button variant="secondary" onClick={open}>{__('Replace image', 'wp3d-blocks')}</Button>
                )}
              />
            </MediaUploadCheck>
            <MediaUploadCheck>
              <Button isDestructive onClick={removeMedia}>{__('Remove image', 'wp3d-blocks')}</Button>
            </MediaUploadCheck>
          </PanelRow>
        }
        {/* {prop.value.id != 0 && 
          
        } */}
      </div>



      {/* 
      <MediaUploadCheck>
        <MediaUpload
          onSelect={(media) => {
            setAttributes({
              mediaFile: {
              title: media.title,
              filename: media.filename,
              url: media.url,
              updated: ''
              }
            })
            }}
          allowedTypes={ ALLOWED_MEDIA_TYPES }
          multiple={false}
          value={ media.id }
          render={({ open }) => (
            <>
              <button variant="primary" onClick={open}>
              {mediaFile === null
                ? '+ Upload file'
                : 'x Upload new file'}
              </button>
              <p>
              {mediaFile === null
                ? ''
                : '(' + mediaFile.title + ')'}
              </p>
            </>
            )}
        />
			</MediaUploadCheck> */}
    </>

  )
}

export default ChooseModel3d;
