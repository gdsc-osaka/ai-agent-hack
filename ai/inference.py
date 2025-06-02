from typing import List, Tuple

import cv2
import dlib
import numpy as np
import numpy.typing as npt
import onnx
import onnxruntime as ort
import torchvision.transforms as transforms
from PIL import Image

from model import Models

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

        self.predictor_5_point_model = Models_obj.pose_predictor_five_point_model_location()
        self.pose_predictor_5_point = dlib.shape_predictor(
            self.predictor_5_point_model)  # type: ignore

        self.cnn_face_detection_model = Models_obj.cnn_face_detector_model_location()
        self.cnn_face_detector = dlib.cnn_face_detection_model_v1(
            self.cnn_face_detection_model)  # type: ignore

        self.dlib_resnet_model = Models_obj.dlib_resnet_model_location()
        self.dlib_resnet_face_encoder = dlib.face_recognition_model_v1(
            self.dlib_resnet_model)  # type: ignore

        self.JAPANESE_FACE_V1 = Models_obj.JAPANESE_FACE_V1_model_location()
        self.JAPANESE_FACE_V1_model = onnx.load(self.JAPANESE_FACE_V1)
        # self.ort_session = ort.InferenceSession(self.JAPANESE_FACE_V1)
        self.ort_session = ort.InferenceSession(self.JAPANESE_FACE_V1, providers=[
                                                'CUDAExecutionProvider', 'CPUExecutionProvider'])

        # 署名表示
        for prop in self.JAPANESE_FACE_V1_model.metadata_props:
            if prop.key == "signature":
                print(prop.value)

    def JAPANESE_FACE_V1_model_compute_face_descriptor(
        self,
        resized_frame: npt.NDArray[np.uint8],
        raw_face_landmark,  # dlib.rectangle type.
        size: int = 224,
        _PADDING: float = 0.1
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

        face_image_np: npt.NDArray = dlib.get_face_chip(
            self.resized_frame, self.raw_face_landmark, size=self.size, padding=self._PADDING)  # type: ignore
        # face_imageをBGRからRGBに変換する
        face_image_rgb = cv2.cvtColor(
            face_image_np, cv2.COLOR_BGR2RGB)  # type: ignore
        # VidCap().frame_imshow_for_debug(face_image_rgb)

        # 入力名を取得
        input_name: str = self.JAPANESE_FACE_V1_model.graph.input[0].name

        # 画像の前処理を定義
        mean_value = [0.485, 0.456, 0.406]
        std_value = [0.229, 0.224, 0.225]
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=mean_value,
                std=std_value
            )
        ])

        # numpy配列からPIL Imageに変換
        face_image_pil: Image.Image = Image.fromarray(face_image_rgb)

        image = transform(face_image_pil)
        image = image.unsqueeze(0)  # バッチ次元を追加  # type: ignore
        image = image.numpy()
        embedding: npt.NDArray[np.float32] = self.ort_session.run(
            None, {input_name: image})[0]  # 'input'をinput_nameに変更
        return embedding

    def _rect_to_css(self, rect: dlib.rectangle) -> Tuple[int, int, int, int]:
        """Convert a dlib 'rect' object to a plain tuple in (top, right, bottom, left) order.

        This method used only 'use_pipe = False'.

        Args:
            dlib.rectangle: dlib rect object

        Returns:
            Tuple[int,int,int,int]: Plain tuple representation of the rect in (top, right, bottom, left) order
        """
        self.rect: dlib.rectangle = rect  # type: ignore
        return self.rect.top(), self.rect.right(), self.rect.bottom(), self.rect.left()

    def _css_to_rect(self, css: Tuple[int, int, int, int]) -> dlib.rectangle:
        self.css: Tuple[int, int, int, int] = css
        """Convert a tuple in (top, right, bottom, left) order to a dlib 'rect' object

        Args:
            Tuple[int,int,int,int]: css
            - Plain tuple representation of the rect in (top, right, bottom, left) order

        Returns:
            dlib.rectangle: <class '_dlib_pybind11.rectangle'>
        """
        return dlib.rectangle(self.css[3], self.css[0], self.css[1], self.css[2])  # type: ignore

    def _trim_css_to_bounds(
        self,
        css: Tuple[int, int, int, int],
        image_shape: Tuple[int, int, int]
    ) -> Tuple[int, int, int, int]:
        self._trim_css_to_bounds_css: Tuple[int, int, int, int] = css
        self.image_shape: Tuple[int, int, int] = image_shape
        """Trim 'css' along with border.

        Make sure a tuple in (top, right, bottom, left) order is within the bounds of the image.
        This method used only 'use_pipe = False'.

        Args:
            Tuple[int,int,int,int]: css
            - Plain tuple representation of the rect in (top, right, bottom, left) order

            Tuple[int,int,int]: image_shape
            - numpy shape of the image array

        Returns:
            Tuple[int,int,int,int]:  a trimmed plain tuple representation of the rect in (top, right, bottom, left) order
        """
        return (
            max(self._trim_css_to_bounds_css[0], 0),
            min(self._trim_css_to_bounds_css[1], self.image_shape[1]),
            min(self._trim_css_to_bounds_css[2], self.image_shape[0]),
            max(self._trim_css_to_bounds_css[3], 0)
        )

    def load_image_file(
        self,
        file: str,
        mode: str = 'RGB'
    ) -> npt.NDArray[np.uint8]:
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
        mode: str = "cnn"
    ) -> List[dlib.rectangle]:  # type: ignore
        """Returns an array of bounding boxes of human faces in a image.

        This method used only 'use_pipe = False'.

        Args:
            npt.NDArray[np.uint8]: resized_frame: An image
            int: number_of_times_to_upsample
            - How many times to upsample the image looking for faces. Higher numbers find smaller faces.

            str: mode
            - Which face detection mode to use. "hog" is less accurate but faster on CPUs. "cnn" is a more accurate deep-learning mode which is GPU/CUDA accelerated (if available). The default is "hog".

        Returns:
            List[dlib.rectangle]: a list of dlib 'rect' objects of found face locations
        """
        self.resized_frame: npt.NDArray[np.uint8] = resized_frame
        self.number_of_times_to_upsample: int = number_of_times_to_upsample
        self.mode: str = mode
        if self.mode == "cnn":
            return self.cnn_face_detector(self.resized_frame, self.number_of_times_to_upsample)
        else:
            return self.face_detector(self.resized_frame, self.number_of_times_to_upsample)

    def face_locations(
        self,
        resized_frame: npt.NDArray[np.uint8],
        number_of_times_to_upsample: int = 0,
        mode: str = "hog"
    ) -> List[Tuple[int, int, int, int]]:
        """Returns an array of bounding boxes of human faces in a image.

        This method used only 'use_pipe = False'.

        Args:
            resized_frame (npt.NDArray[np.uint8]): Resized image
            number_of_times_to_upsample (int): How many times to upsample the image looking for faces. Higher numbers find smaller faces.
            mode (str): Which face detection mode to use. "hog" is less accurate but faster on CPUs. "cnn" is a more accurate deep-learning mode which is GPU/CUDA accelerated (if available). The default is "hog".

        Returns:
            A list of tuples of found face locations in css (top, right, bottom, left) order
        """
        self.resized_frame: npt.NDArray[np.uint8] = resized_frame
        self.number_of_times_to_upsample: int = number_of_times_to_upsample
        self.mode: str = mode
        face_locations: List[Tuple[int, int, int, int]] = []

        if self.mode == 'cnn':
            for face in self._raw_face_locations(
                self.resized_frame,
                self.number_of_times_to_upsample,
                self.mode
            ):
                face_locations.append(
                    self._trim_css_to_bounds(
                        self._rect_to_css(face.rect),
                        self.resized_frame.shape
                    )
                )
        else:
            for face in self._raw_face_locations(
                self.resized_frame,
                self.number_of_times_to_upsample,
                self.mode
            ):
                face_locations.append(
                    self._trim_css_to_bounds(
                        self._rect_to_css(face),
                        self.resized_frame.shape
                    )
                )

        return face_locations

    def _return_raw_face_landmarks(
        self,
        resized_frame: npt.NDArray[np.uint8],
        face_location_list: List[Tuple[int, int, int, int]],
        model: str = "small"
    ) -> List[dlib.rectangle]:  # type: ignore

        # type: ignore
        new_face_location_list: List[dlib.rectangle[Tuple[int, int, int, int]]] = [
        ]
        raw_face_location: Tuple[int, int, int, int]

        for raw_face_location in face_location_list:
            new_face_location_list.append(self._css_to_rect(raw_face_location))

        # type: ignore
        raw_face_landmarks: List[dlib.rectangle[Tuple[int, int, int, int]]] = [
        ]
        # type: ignore
        new_face_location: dlib.rectangle[Tuple[int, int, int, int]]

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
        face_location_list: List = [],
        num_jitters: int = 0,
        model: str = "small"
    ) -> List[np.ndarray]:
        """Given an image, return the 128-dimension face encoding for each face in the image.

        Args:
            resized_frame (npt.NDArray[np.uint8]): The image that contains one or more faces (=small_frame)
            face_location_list (List): Optional - the bounding boxes of each face if you already know them. (=face_location_list)
            num_jitters (int): How many times to re-sample the face when calculating encoding. Higher is more accurate, but slower (i.e. 100 is 100x slower)
            model (str): Do not modify.

        Returns:
            List[npt.NDArray[np.float64]]: A list of 128-dimensional face encodings (one for each face in the image).

            If deep_learning_model == 1, the returned list contains 512-dimensional face encodings, with the type
            List[npt.NDArray[np.float32]].

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
        self.face_location_list: List = face_location_list
        self.num_jitters: int = num_jitters
        self.face_encodings_model: str = model
        _PADDING: float = 0.25  # dlib学習モデル用
        face_encodings: List[npt.NDArray[np.float64]] = []

        if len(self.face_location_list) > 0:
            raw_face_landmarks: List = self._return_raw_face_landmarks(
                self.face_encodings_resized_frame,
                self.face_location_list,
                self.face_encodings_model
            )

            raw_face_landmark: dlib.full_object_detection  # type: ignore
            face_landmark_ndarray: npt.NDArray[np.float64] = np.array([])
            if self.deep_learning_model == 0:
                for raw_face_landmark in raw_face_landmarks:
                    # face_landmark_ndarray: npt.NDArray[np.float64] = []
                    face_landmark_ndarray: npt.NDArray[np.float64] = np.array(
                        # Make 128 dimensional vector
                        self.dlib_resnet_face_encoder.compute_face_descriptor(
                            self.face_encodings_resized_frame,
                            raw_face_landmark,
                            self.num_jitters,
                            _PADDING
                        )
                    )
                    face_encodings.append(face_landmark_ndarray)
            elif self.deep_learning_model == 1:
                for raw_face_landmark in raw_face_landmarks:
                    face_landmark_ndarray: npt.NDArray[np.float64] = np.array(
                        self.JAPANESE_FACE_V1_model_compute_face_descriptor(
                            self.face_encodings_resized_frame,
                            raw_face_landmark,
                            size=224,
                            _PADDING=0.1
                        )
                    ).astype(np.float64)
                    face_encodings.append(face_landmark_ndarray)  # 修正: 各顔のエンコーディングをリストに追加
        return face_encodings

    def face_distance(
        self,
        face_encodings: List[npt.NDArray[np.float64]],
        face_to_compare: npt.NDArray[np.float64]
        # face_encodings: List[np.ndarray],
        # face_to_compare: np.ndarray
    ) -> npt.NDArray[np.float64]:
        """与えられた顔エンコーディングのリストを既知の顔エンコーディングと比較し、各比較顔のユークリッド距離を返します.

        距離が近ければ、顔がどれだけ似ているかが分かります。

        Args:
            face_encodings (List[npt.NDArray[np.float64]]): List of face encodings to compare (=small_frame)
            face_to_compare (npt.NDArray[np.float64]): A face encoding to compare against (=face_location_list)

        Returns:
            npt.NDArray[np.float64]: 顔（名前）配列と同じ順序の、顔同士の距離である numpy ndarray を返します
        """
        # self.face_encodings = face_encodings
        # self.face_to_compare = face_to_compare

        if len(face_encodings) == 0:
            # return dummy data
            return np.empty((2, 2, 3), dtype=np.float64)

        # ord = None -> Frobenius norm. norm for vectors is '2-norm'.
        # See:
        # document: https://numpy.org/doc/stable/reference/generated/numpy.linalg.norm.html
        # [全成分の二乗和のルートをフロベニウスノルムと言います。](https://manabitimes.jp/math/1284)
        # > フロベニウスノルムは，行列の全成分を一列に並べてベクトルとみなしたときのベクトルの長さ（2ノルム）と考えることもできます。
        return np.linalg.norm(x=(face_encodings - face_to_compare), axis=1)

    def cosine_similarity(self, embedding1, embedding2, threshold=0.4):
        """
        cosine_similarity 特徴量ベクトルを受け取り、類似度を計算し、閾値を超えているかどうかを返す

        Args:
            embedding1 (npt.NDArray): feature vector
            embedding2 (npt.NDArray): feature vector
            threshold (float, optional): threshold. Defaults to 0.4.

        Returns:
            Tuple[np.array, float]: Returns a tuple of a numpy array of booleans and the minimum cos_sim
        """
        results: List[Tuple[bool, float]] = []
        max_cos_sim = float(0.0)
        embedding2 = embedding2.flatten()
        for emb1 in embedding1:
            emb1 = emb1.flatten()
            cos_sim: float = np.dot(
                emb1, embedding2) / (np.linalg.norm(emb1) * np.linalg.norm(embedding2))
            if cos_sim >= threshold:
                results.append((True, cos_sim))
            else:
                results.append((False, cos_sim))
            max_cos_sim = max(max_cos_sim, cos_sim)
        return results, max_cos_sim

    def percentage(self, cos_sim):
        """
        percentage 与えられた cos_sim から類似度を計算する

        Args:
            cos_sim (float): cosine similarity

        Returns:
            float: percentage of similarity
        """
        # BUG: Issue #25
        return round(-23.71 * cos_sim ** 2 + 49.98 * cos_sim + 73.69, 2)

    def compare_faces(
        self,
        deep_learning_model: int,
        known_face_encodings: List[npt.NDArray[np.float64]],
        face_encoding_to_check: npt.NDArray[np.float64],
        tolerance: float = 0.6,
        threshold: float = 0.4
    ) -> Tuple[np.ndarray, float]:
        """顔エンコーディングのリストを候補エンコーディングと比較して、それら数値の比較をします。

        Args:
            deep_learning_model (int): 0: dlib cnn model, 1: JAPANESE_FACE_V1.onnx
            known_face_encodings (List[npt.NDArray[np.float64]]): known face encodingsのリスト
            face_encoding_to_check (npt.NDArray[np.float64]): リストに対して比較する、単一の顔エンコーディング
            tolerance (float): 顔間の距離がどのくらいあれば一致するとみなされるか。dlibの場合、低いほど厳密で、0.6 が一般的な値です。
            threshold (float): 閾値

        Returns:
            どの known_face_encoding がチェック対象の顔エンコーディングに一致するか、およびそれらの間の最小距離を示す True/False 値のタプル。
        """
        self.deep_learning_model: int = deep_learning_model
        self.known_face_encodings: List[npt.NDArray[np.float64]] = known_face_encodings
        self.face_encoding_to_check: npt.NDArray[np.float64] = face_encoding_to_check
        self.tolerance: float = tolerance
        self.threshold: float = threshold

        # dlib model:
        if self.deep_learning_model == 0:
            face_distance_list: List[float] = list(
                self.face_distance(
                    self.known_face_encodings,
                    self.face_encoding_to_check
                )
            )

            self.min_distance: float = min(face_distance_list)

            if self.min_distance > self.tolerance:
                return np.full(len(face_distance_list), False), self.min_distance
            else:
                bool_list: List[Tuple[bool, float]] = []
                for face_distance in face_distance_list:
                    if self.tolerance >= face_distance:  # face_distanceがtolerance以下のとき。
                        bool_list.append((True, face_distance))
                    elif self.tolerance < face_distance:
                        bool_list.append((False, face_distance))
                    else:
                        raise Exception(
                            f"Unexpected face_distance: {face_distance} with tolerance: {self.tolerance}"
                        )
                return np.array(bool_list), self.min_distance

        # JAPANESE_FACE_V1 model:
        elif self.deep_learning_model == 1:
            results: List[Tuple[bool, float]] = []
            results, max_cos_sim = \
                self.cosine_similarity(
                    self.known_face_encodings, self.face_encoding_to_check, self.threshold)
            return np.array(results), max_cos_sim

    def verify(
        self,
        image_path1: str,
        image_path2: str,
        threshold: float = 0.3
    ) -> bool:
        """
        verify()メソッドは、入力された2枚の画像が同一人物かどうかを判定します。
        dlibの学習モデルは使わず、JAPANESE_FACE_V1モデルのみ使用します。

        Args:
            image_path1 (str): 1枚目の画像ファイルパス
            image_path2 (str): 2枚目の画像ファイルパス
            threshold (float): 0 ~ 1 の範囲で指定するコサイン類似度のしきい値(デフォルト0.3)

        Returns:
            bool: True なら同一人物、False なら別人
        """

        frame1: npt.NDArray[np.uint8] = self.load_image_file(image_path1)
        face_locations1 = self.face_locations(frame1, number_of_times_to_upsample=0, mode='cnn')
        if len(face_locations1) == 0:
            print(f"画像1({image_path1})から顔が検出できませんでした。")
            return False

        encodings1 = self.face_encodings(
            deep_learning_model=1,
            resized_frame=frame1,
            face_location_list=face_locations1
        )
        if len(encodings1) == 0:
            print(f"画像1({image_path1})の特徴量を抽出できませんでした。")
            return False

        frame2: npt.NDArray[np.uint8] = self.load_image_file(image_path2)
        face_locations2 = self.face_locations(frame2, number_of_times_to_upsample=0, mode='cnn')
        if len(face_locations2) == 0:
            print(f"画像2({image_path2})から顔が検出できませんでした。")
            return False

        encodings2 = self.face_encodings(
            deep_learning_model=1,
            resized_frame=frame2,
            face_location_list=face_locations2
        )
        if len(encodings2) == 0:
            print(f"画像2({image_path2})の特徴量を抽出できませんでした。")
            return False

        embedding1 = encodings1[0]
        embedding2 = encodings2[0]

        emb_list = np.array([embedding1])
        sim_result, max_cos_sim = self.cosine_similarity(emb_list, embedding2, threshold=threshold)

        is_same_person = sim_result[0][0]
        if is_same_person:
            print(f"2枚の画像は同一人物と判定しました。cos_sim={sim_result[0][1]:.3f}")
        else:
            print(f"2枚の画像は別人と判定しました。cos_sim={sim_result[0][1]:.3f}")
        return is_same_person