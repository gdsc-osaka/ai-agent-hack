import os
import time
from typing import BinaryIO, Union

import cv2
import dlib
import numpy as np
import numpy.typing as npt
import onnx
import onnxruntime as ort
import torchvision.transforms as transforms
from PIL import Image
from insightface.app import FaceAnalysis

from model.load import Models


class Dlib_api:
    """Dlib api.

    Author: Original code written by Adam Geitgey, modified by YOSHITSUGU KESAMARU

    Email: y.kesamaru@tokai-kaoninsho.com
    """

    def __init__(
        self,
    ) -> None:
        """init.

        Args:
            log_level (str, optional): Receive log level value. Defaults to 'info'.
        """
        Models_obj = Models()

        self.face_detector = dlib.get_frontal_face_detector()  # type: ignore

        self.predictor_5_point_model = (
            Models_obj.pose_predictor_five_point_model_location()
        )
        self.pose_predictor_5_point = dlib.shape_predictor(self.predictor_5_point_model)  # type: ignore

        self.face_app = FaceAnalysis(
            providers=["CUDAExecutionProvider", "CPUExecutionProvider"]
        )
        self.face_app.prepare(ctx_id=0, det_size=(640, 640))

        self.JAPANESE_FACE_V1 = Models_obj.JAPANESE_FACE_V1_model_location()
        self.JAPANESE_FACE_V1_model = onnx.load(self.JAPANESE_FACE_V1)
        self.ort_session = ort.InferenceSession(
            self.JAPANESE_FACE_V1,
            providers=["CUDAExecutionProvider", "CPUExecutionProvider"],
        )

        # 署名表示
        for prop in self.JAPANESE_FACE_V1_model.metadata_props:
            if prop.key == "signature":
                print(prop.value)

    def JAPANESE_FACE_V1_model_compute_face_descriptor(
        self,
        resized_frame: npt.NDArray[np.uint8],
        raw_face_landmark,  # dlib.rectangle type.
        size: int = 224,
        _PADDING: float = 0.1,
        debug: bool = True,
    ) -> npt.NDArray[np.float32]:
        """JAPANESE FACE V1モデルを使用して顔の特徴量を計算します。

        この関数は、与えられた顔の画像データから、JAPANESE FACE V1モデルを使用して顔の特徴量（embedding）を計算します。

        Args:
            resized_frame (npt.NDArray[np.uint8]): リサイズされたフレームの画像データ。
            raw_face_landmark (dlib.rectangle): 顔のランドマーク情報。
            size (int, optional): 顔のチップのサイズ。デフォルトは224。
            _PADDING (float, optional): 顔のチップを取得する際のパディング。デフォルトは0.1。

        Returns:
            npt.NDArray[np.float32]: 顔の特徴量（embedding）。
        """
        self.resized_frame: npt.NDArray[np.uint8] = resized_frame
        # VidCap().frame_imshow_for_debug(self.resized_frame)

        self.raw_face_landmark = raw_face_landmark  # dlib.rectangle type.
        # print(self.raw_face_landmark)

        self.size: int = size
        self._PADDING: float = _PADDING

        face_image_np: npt.NDArray = dlib.get_face_chip( # type: ignore
            self.resized_frame,
            self.raw_face_landmark,
            size=self.size,
            padding=self._PADDING,
        )

        # デバッグ用: クロップした顔画像を保存
        if debug:
            debug_dir = "debug_face_crops"
            os.makedirs(debug_dir, exist_ok=True)

            # タイムスタンプを使ってユニークなファイル名を生成
            timestamp = int(time.time() * 1000)  # ミリ秒単位のタイムスタンプ
            debug_filename = f"{debug_dir}/face_crop_{timestamp}.jpg"

            # BGRフォーマットで保存（OpenCVの標準フォーマット）
            cv2.imwrite(debug_filename, face_image_np)
            print(f"Debug: Cropped face saved to {debug_filename}")

        # face_imageをBGRからRGBに変換する
        face_image_rgb = cv2.cvtColor(face_image_np, cv2.COLOR_BGR2RGB)  # type: ignore
        # VidCap().frame_imshow_for_debug(face_image_rgb)

        # 入力名を取得
        input_name: str = self.JAPANESE_FACE_V1_model.graph.input[0].name

        # 画像の前処理を定義
        mean_value = [0.485, 0.456, 0.406]
        std_value = [0.229, 0.224, 0.225]
        transform = transforms.Compose(
            [
                transforms.Resize((224, 224)),
                transforms.ToTensor(),
                transforms.Normalize(mean=mean_value, std=std_value),
            ]
        )

        # numpy配列からPIL Imageに変換
        face_image_pil: Image.Image = Image.fromarray(face_image_rgb)

        image = transform(face_image_pil)
        image = image.unsqueeze(0)  # バッチ次元を追加  # type: ignore
        image = image.numpy()
        embedding: npt.NDArray[np.float32] = np.array(
            self.ort_session.run(None, {input_name: image})[0], dtype=np.float32
        )
        return embedding

    def _rect_to_css(self, rect: dlib.rectangle) -> tuple[int, int, int, int]: # type: ignore
        """Convert a dlib 'rect' object to a plain tuple in (top, right, bottom, left) order.

        This method used only 'use_pipe = False'.

        Args:
            dlib.rectangle: dlib rect object

        Returns:
            tuple[int,int,int,int]: Plain tuple representation of the rect in (top, right, bottom, left) order
        """
        self.rect: dlib.rectangle = rect  # type: ignore
        return self.rect.top(), self.rect.right(), self.rect.bottom(), self.rect.left()

    def _css_to_rect(self, css: tuple[int, int, int, int]) -> dlib.rectangle: # type: ignore
        self.css: tuple[int, int, int, int] = css
        """Convert a tuple in (top, right, bottom, left) order to a dlib 'rect' object

        Args:
            tuple[int,int,int,int]: css
            - Plain tuple representation of the rect in (top, right, bottom, left) order

        Returns:
            dlib.rectangle: <class '_dlib_pybind11.rectangle'>
        """
        return dlib.rectangle(self.css[3], self.css[0], self.css[1], self.css[2])  # type: ignore

    def _trim_css_to_bounds(
        self, css: tuple[int, int, int, int], image_shape: tuple[int, int, int]
    ) -> tuple[int, int, int, int]:
        self._trim_css_to_bounds_css: tuple[int, int, int, int] = css
        self.image_shape: tuple[int, int, int] = image_shape
        """Trim 'css' along with border.

        Make sure a tuple in (top, right, bottom, left) order is within the bounds of the image.
        This method used only 'use_pipe = False'.

        Args:
            tuple[int,int,int,int]: css
            - Plain tuple representation of the rect in (top, right, bottom, left) order

            tuple[int,int,int]: image_shape
            - numpy shape of the image array

        Returns:
            tuple[int,int,int,int]:  a trimmed plain tuple representation of the rect in (top, right, bottom, left) order
        """
        return (
            max(self._trim_css_to_bounds_css[0], 0),
            min(self._trim_css_to_bounds_css[1], self.image_shape[1]),
            min(self._trim_css_to_bounds_css[2], self.image_shape[0]),
            max(self._trim_css_to_bounds_css[3], 0),
        )

    def load_image_file(self, file: str, mode: str = "RGB") -> npt.NDArray[np.uint8]:
        """Loads an image file (.jpg, .png, etc) into a numpy array.

        Args:
            file (str): image file name or file object to load
            mode (str): format to convert the image to. Only 'RGB' (8-bit RGB, 3 channels) and 'L' (black and white) are supported.

        Returns:
            npt.NDArray[np.uint8]: image contents as numpy array
        """
        self.file = file
        self.mode = mode
        im = Image.open(self.file)

        if self.mode:
            im = im.convert(self.mode)

        return np.array(im)

    def _raw_face_locations(
        self,
        resized_frame: npt.NDArray[np.uint8],
        number_of_times_to_upsample: int = 0,
        mode: str = "cnn",
    ) -> list[dlib.rectangle]:  # type: ignore
        """Returns an array of bounding boxes of human faces in a image.

        This method used only 'use_pipe = False'.

        Args:
            npt.NDArray[np.uint8]: resized_frame: An image
            int: number_of_times_to_upsample
            - How many times to upsample the image looking for faces. Higher numbers find smaller faces.

            str: mode
            - Which face detection mode to use. "hog" is less accurate but faster on CPUs. "cnn" is a more accurate deep-learning mode which is GPU/CUDA accelerated (if available). "insightface" uses InsightFace detection (highest accuracy).

        Returns:
            list[dlib.rectangle]: a list of dlib 'rect' objects of found face locations
        """
        self.resized_frame: npt.NDArray[np.uint8] = resized_frame
        self.number_of_times_to_upsample: int = number_of_times_to_upsample
        self.mode: str = mode

        if self.mode == "insightface":
            face_locations = self.insightface_face_locations(self.resized_frame)
            return self.insightface_face_landmarks(self.resized_frame, face_locations)
        else:
            return self.face_detector(
                self.resized_frame, self.number_of_times_to_upsample
            )
        
    def insightface_face_locations(
        self,
        resized_frame: npt.NDArray[np.uint8],
    ) -> list[tuple[int, int, int, int]]:
        """InsightFaceを使って高精度な顔検出を行う

        Args:
            resized_frame: 入力画像

        Returns:
            顔の位置のリスト (top, right, bottom, left)
        """
        # RGBからBGRに変換（InsightFaceはBGR形式を期待）
        bgr_frame = cv2.cvtColor(resized_frame, cv2.COLOR_RGB2BGR)

        # InsightFaceで顔検出
        faces = self.face_app.get(bgr_frame)
        face_locations = []

        for face in faces:
            bbox = face.bbox.astype(int)
            x1, y1, x2, y2 = bbox
            # (top, right, bottom, left)形式に変換
            face_locations.append((y1, x2, y2, x1))

        return face_locations

    def insightface_face_landmarks(
        self,
        resized_frame: npt.NDArray[np.uint8],
        face_location_list: list[tuple[int, int, int, int]],
    ) -> list[dlib.rectangle]: # type: ignore
        """InsightFaceの検出結果をdlib.rectangleに変換

        Args:
            resized_frame: 入力画像
            face_location_list: 顔の位置リスト

        Returns:
            dlib.rectangle形式の顔の位置リスト
        """
        rectangles = []
        for face_location in face_location_list:
            top, right, bottom, left = face_location
            # dlib.rectangleに変換
            rect = dlib.rectangle(left, top, right, bottom) # type: ignore
            rectangles.append(rect)

        return rectangles
    
    def face_locations(
        self,
        resized_frame: npt.NDArray[np.uint8],
        number_of_times_to_upsample: int = 0,
        mode: str = "insightface",  # デフォルトをinsightfaceに変更
    ) -> list[tuple[int, int, int, int]]:
        """Returns an array of bounding boxes of human faces in a image.

        This method used only 'use_pipe = False'.

        Args:
            resized_frame (npt.NDArray[np.uint8]): Resized image
            number_of_times_to_upsample (int): How many times to upsample the image looking for faces. Higher numbers find smaller faces.
            mode (str): Which face detection mode to use. "hog" is less accurate but faster on CPUs. "cnn" is a more accurate deep-learning mode which is GPU/CUDA accelerated (if available). "insightface" uses InsightFace detection (highest accuracy).

        Returns:
            A list of tuples of found face locations in css (top, right, bottom, left) order
        """
        self.resized_frame: npt.NDArray[np.uint8] = resized_frame
        self.number_of_times_to_upsample: int = number_of_times_to_upsample
        self.mode: str = mode
        face_locations: list[tuple[int, int, int, int]] = []

        if self.mode == "insightface":
            # InsightFaceで直接顔検出
            return self.insightface_face_locations(self.resized_frame)
        else:
            for face in self._raw_face_locations(
                self.resized_frame, self.number_of_times_to_upsample, self.mode
            ):
                face_locations.append(
                    self._trim_css_to_bounds(
                        self._rect_to_css(face), self.resized_frame.shape # type: ignore
                    )
                )

        return face_locations

    def _return_raw_face_landmarks(
        self,
        resized_frame: npt.NDArray[np.uint8],
        face_location_list: list[tuple[int, int, int, int]],
        model: str = "small",
    ) -> list[dlib.rectangle]:  # type: ignore
        # type: ignore
        new_face_location_list: list[dlib.rectangle[tuple[int, int, int, int]]] = [] # type: ignore
        raw_face_location: tuple[int, int, int, int]

        for raw_face_location in face_location_list:
            new_face_location_list.append(self._css_to_rect(raw_face_location))

        # type: ignore
        raw_face_landmarks: list[dlib.rectangle[tuple[int, int, int, int]]] = [] # type: ignore
        # type: ignore
        new_face_location: dlib.rectangle[tuple[int, int, int, int]] # type: ignore

        for new_face_location in new_face_location_list:
            raw_face_landmarks.append(
                self.pose_predictor_5_point(resized_frame, new_face_location)
            )

        return raw_face_landmarks

    def face_encodings(
        self,
        deep_learning_model: int,
        resized_frame: npt.NDArray[np.uint8],
        # Initial value of 'face_location_list' is '[]'.
        face_location_list: list = [],
        num_jitters: int = 0,
        model: str = "small",
    ) -> list[np.ndarray]:
        """Given an image, return the 128-dimension face encoding for each face in the image.

        Args:
            resized_frame (npt.NDArray[np.uint8]): The image that contains one or more faces (=small_frame)
            face_location_list (list): Optional - the bounding boxes of each face if you already know them. (=face_location_list)
            num_jitters (int): How many times to re-sample the face when calculating encoding. Higher is more accurate, but slower (i.e. 100 is 100x slower)
            model (str): Do not modify.

        Returns:
            list[npt.NDArray[np.float64]]: A list of 128-dimensional face encodings (one for each face in the image).

            If deep_learning_model == 1, the returned list contains 512-dimensional face encodings, with the type
            list[npt.NDArray[np.float32]].

            Image size: The image should be of size 150x150. Also, cropping must be done as dlib.get_face_chip would do it.
            That is, centered and scaled essentially the same way.

        See also:
            class dlib.face_recognition_model_v1: compute_face_descriptor(*args, **kwargs):
            http://dlib.net/python/index.html#dlib_pybind11.face_recognition_model_v1

            compute_face_descriptor(*args, **kwargs):
            http://dlib.net/python/index.html#dlib_pybind11.face_recognition_model_v1.compute_face_descriptor
        """
        self.deep_learning_model: int = deep_learning_model
        self.face_encodings_resized_frame: npt.NDArray[np.uint8] = resized_frame
        self.face_location_list: list = face_location_list
        self.num_jitters: int = num_jitters
        self.face_encodings_model: str = model
        _PADDING: float = 0.25  # dlib学習モデル用
        face_encodings: list[npt.NDArray[np.float64]] = []

        if len(self.face_location_list) > 0:
            raw_face_landmarks: list = self._return_raw_face_landmarks(
                self.face_encodings_resized_frame,
                self.face_location_list,
                self.face_encodings_model,
            )

            raw_face_landmark: dlib.full_object_detection  # type: ignore
            face_landmark_ndarray: npt.NDArray[np.float64] = np.array([])
            for raw_face_landmark in raw_face_landmarks:
                face_landmark_ndarray: npt.NDArray[np.float64] = np.array(
                    self.JAPANESE_FACE_V1_model_compute_face_descriptor(
                        self.face_encodings_resized_frame,
                        raw_face_landmark,
                        size=224,
                        _PADDING=0.1,
                        debug=False,
                    )
                ).astype(np.float64)
                face_encodings.append(
                    face_landmark_ndarray
                )  # 修正: 各顔のエンコーディングをリストに追加
        return face_encodings

    def cosine_similarity(self, embedding1, embedding2, threshold=0.4):
        """
        cosine_similarity 特徴量ベクトルを受け取り、類似度を計算し、閾値を超えているかどうかを返す

        Args:
            embedding1 (npt.NDArray): feature vector
            embedding2 (npt.NDArray): feature vector
            threshold (float, optional): threshold. Defaults to 0.4.

        Returns:
            tuple[np.array, float]: Returns a tuple of a numpy array of booleans and the minimum cos_sim
        """
        results: list[tuple[bool, float]] = []
        max_cos_sim = float(0.0)
        embedding2 = embedding2.flatten()
        for emb1 in embedding1:
            emb1 = emb1.flatten()
            cos_sim: float = np.dot(emb1, embedding2) / (
                np.linalg.norm(emb1) * np.linalg.norm(embedding2)
            )
            if cos_sim >= threshold:
                results.append((True, cos_sim))
            else:
                results.append((False, cos_sim))
            max_cos_sim = max(max_cos_sim, cos_sim)
        return results, max_cos_sim

    def load_image_from_binary(self, file: BinaryIO, mode: str = "RGB") -> npt.NDArray[np.uint8]:
        self.file = file
        self.mode = mode
        
        # ファイルポインタを先頭に戻す
        if hasattr(file, 'seek'):
            file.seek(0)
        
        # PILでバイナリデータから画像を読み込み
        im = Image.open(file)

        if self.mode:
            im = im.convert(self.mode)

        return np.array(im)

    def embedding(
        self, image_input: Union[str, BinaryIO],
    ) -> npt.NDArray[np.float32]:
        """
        画像から顔の特徴量（embedding）を抽出します。
        dlibの学習モデルは使わず、JAPANESE_FACE_V1モデルのみ使用します。

        Args:
            image_input (Union[str, BinaryIO]): 画像ファイルパス または バイナリファイルオブジェクト

        Returns:
            npt.NDArray[np.float32]: 顔の特徴量（embedding）

        Raises:
            ValueError: 顔が検出されない場合や特徴量抽出に失敗した場合
        """
        # 入力タイプに応じて画像を読み込み
        if isinstance(image_input, str):
            # ファイルパスの場合
            frame: npt.NDArray[np.uint8] = self.load_image_file(image_input)
            image_identifier = image_input
        else:
            # BinaryIOの場合
            frame: npt.NDArray[np.uint8] = self.load_image_from_binary(image_input)
            image_identifier = "binary_input"
        
        # 顔検出
        face_locations = self.face_locations(
            frame, number_of_times_to_upsample=0, mode="insightface"
        )
        if len(face_locations) == 0:
            raise ValueError(
                f"画像({image_identifier})に顔が検出されませんでした。"
            )
        
        # 特徴量抽出
        encodings = self.face_encodings(
            deep_learning_model=1,
            resized_frame=frame,
            face_location_list=face_locations,
        )
        if len(encodings) == 0:
            raise ValueError(
                f"画像({image_identifier})の顔から特徴量を抽出できませんでした。"
            )

        return encodings[0]
