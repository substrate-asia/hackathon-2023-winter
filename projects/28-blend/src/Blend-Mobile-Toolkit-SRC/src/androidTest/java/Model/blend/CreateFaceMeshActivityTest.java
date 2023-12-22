package Model.blend;

import android.Manifest;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.example.blend.R;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageMetadata;
import com.google.firebase.storage.StorageReference;

import org.junit.Test;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class CreateFaceMeshActivityTest {

    @Test
    public void testSendImageToFlask() {

        class CreateFaceMeshActivity extends AppCompatActivity {

            private static final int PICK_IMAGE_REQUEST = 1;
            private static final int CAPTURE_IMAGE_REQUEST = 2;
            private static final int CAMERA_PERMISSION_REQUEST_CODE = 100;

            public Uri selectedImageUri;
            private ProgressBar progressBar;
            private ImageButton btnUploadImage;

            private FirebaseAuth mAuth;
            private FirebaseFirestore db;
            private StorageReference storageRef;
            public Bitmap capturedPhoto;

            @Override
            protected void onCreate(Bundle savedInstanceState) {
                super.onCreate(savedInstanceState);
                setContentView(R.layout.activity_upload);

                mAuth = FirebaseAuth.getInstance();
                db = FirebaseFirestore.getInstance();
                storageRef = FirebaseStorage.getInstance().getReference();

                btnUploadImage = findViewById(R.id.btnuploadimage);
                progressBar = findViewById(R.id.loadingProgressBar);

                Button btnBackToProfile = findViewById(R.id.btnBack);
                Button btnStartGenerating = findViewById(R.id.btnStartGenerating);
                EditText etJobName = findViewById(R.id.etJobName);

                btnBackToProfile.setOnClickListener(view -> {
//                    Intent intent = new Intent(Model.blend.CreateFaceMeshActivity.this, ProfileActivity.class);
//                    startActivity(intent);
//                    finish();
                });

                btnUploadImage.setOnClickListener(view -> {
                    // Implement logic for uploading image, either from camera or device
                    showImageSourceDialog();

                });

                btnStartGenerating.setOnClickListener(view -> {

                    // Implement logic for starting face mesh generation
                    String jobName = etJobName.getText().toString().trim();
                    if (!jobName.isEmpty()) {
                        if (selectedImageUri != null) {
                            // Image from gallery
                            sendImageToFlask(selectedImageUri, null, jobName);
                        } else {
                            // Image captured with camera
                            sendImageToFlask(null, capturedPhoto, jobName);
                        }
                        progressBar.setVisibility(View.VISIBLE);
                    } else {
                        // Show an error message or handle invalid input
                        Toast.makeText(this, "Please provide a valid job name", Toast.LENGTH_SHORT).show();
                    }
                });
            }

            private void openImagePicker() {
                // Launches the image picker

                Intent intent = new Intent(Intent.ACTION_PICK, MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                intent.setType("image/*");
                startActivityForResult(intent, PICK_IMAGE_REQUEST);
            }

            private void openCamera() {
                // Check if the CAMERA permission is granted
                if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                        != PackageManager.PERMISSION_GRANTED) {
                    // Request the CAMERA permission if not granted
                    ActivityCompat.requestPermissions(this,
                            new String[]{Manifest.permission.CAMERA},
                            CAMERA_PERMISSION_REQUEST_CODE);
                } else {
                    // Open the camera if permission is already granted
                    launchCameraIntent();
                }
            }
            @Override
            public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
                super.onRequestPermissionsResult(requestCode, permissions, grantResults);
                if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
                    // Check if the CAMERA permission is granted
                    if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                        // Permission granted, open the camera
                        launchCameraIntent();
                    } else {
                        // Permission denied, show a message or handle it accordingly
                        Toast.makeText(this, "Camera permission is required to capture images", Toast.LENGTH_SHORT).show();
                    }
                }
            }

            private void launchCameraIntent() {
                // Launch the camera for capturing an image
                Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                startActivityForResult(intent, CAPTURE_IMAGE_REQUEST);
            }
            private void showImageSourceDialog() {
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle("Choose Image Source")
                        .setItems(new CharSequence[]{"Capture", "Upload"}, new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialog, int which) {
                                switch (which) {
                                    case 0:
                                        // "Capture" option selected
                                        openCamera();
                                        break;
                                    case 1:
                                        // "Upload" option selected
                                        openImagePicker();
                                        break;
                                }
                            }
                        });

                builder.create().show();
            }
            @Override
            protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
                super.onActivityResult(requestCode, resultCode, data);

                if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null) {
                    // Handle the selected image, you may want to display it in your UI
                    selectedImageUri = data.getData();
                    btnUploadImage.setImageURI(selectedImageUri);

                    // Reset captured photo
                    capturedPhoto = null;
                } else if (requestCode == CAPTURE_IMAGE_REQUEST && resultCode == RESULT_OK && data != null) {
                    // Handle the captured image
                    capturedPhoto = (Bitmap) data.getExtras().get("data");
                    btnUploadImage.setImageBitmap(capturedPhoto);

                    // Reset selected image URI
                    selectedImageUri = null;
                }
            }

            private File bitmapToFile(Bitmap capturedPhoto) {
                File imageFile = null;
                try {
                    imageFile = File.createTempFile("captured_image", ".png", getCacheDir());
                    // Compress the bitmap and save to the file
                    FileOutputStream fos = new FileOutputStream(imageFile);
                    capturedPhoto.compress(Bitmap.CompressFormat.PNG, 100, fos);
                    fos.flush();
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }

                return imageFile;
            }

            public void sendImageToFlask(Uri imageUri, Bitmap capturedImage, String jobName) {
                File imageFile;
                if (imageUri != null) {
                    // Image from gallery
                    imageFile = new File(getRealPathFromUri(imageUri));
                } else if (capturedImage != null) {
                    // Image captured with camera
                    imageFile = bitmapToFile(capturedImage);
                } else {

                    return;
                }

                OkHttpClient client = new OkHttpClient.Builder()
                        .connectTimeout(20, TimeUnit.SECONDS)
                        .readTimeout(20, TimeUnit.SECONDS)
                        .writeTimeout(20, TimeUnit.SECONDS)
                        .build();

                RequestBody requestBody = new MultipartBody.Builder()
                        .setType(MultipartBody.FORM)
                        .addFormDataPart("imageFile", jobName, RequestBody.create(MediaType.parse("image/*"), imageFile))
                        .addFormDataPart("jobName", jobName)
                        .build();

                Request request = new Request.Builder()
                        .url("http://18.141.247.246:3200/process-image")
                        .post(requestBody)
                        .build();

                client.newCall(request).enqueue(new Callback() {
                    @Override
                    public void onFailure(Call call, IOException e) {
                        e.printStackTrace();
                        runOnUiThread(() -> {
                            progressBar.setVisibility(View.GONE);
//                            Toast.makeText(Model.blend.CreateFaceMeshActivity.this, "Failed to send image to the server", Toast.LENGTH_SHORT).show();
                        });
                    }

                    @Override
                    public void onResponse(Call call, Response response) throws IOException {

                        if (response.isSuccessful()) {
                            String contentType = response.header("Content-Type");
                            if (contentType != null && contentType.equals("application/x-tgif")) {
                                saveTGIFFileToStorage(jobName, response.body().bytes());
                            } else {
                                runOnUiThread(() -> {
//                                    Toast.makeText(Model.blend.CreateFaceMeshActivity.this, "Unsupported content type received", Toast.LENGTH_SHORT).show();
                                });
                            }
                        } else {
                            runOnUiThread(() -> {
                                if (response.isSuccessful()) {
//                                    moveToComputationInProgressActivity();
                                } else {
                                    progressBar.setVisibility(View.GONE);
//                                    Toast.makeText(Model.blend.CreateFaceMeshActivity.this, "Failed to send image to the server", Toast.LENGTH_SHORT).show();
                                }
                            });
                        }
                    }

                    private void saveTGIFFileToStorage(String jobName, byte[] tgifResponseBytes) {
                        FirebaseUser user = mAuth.getCurrentUser();
                        String fileName = jobName;
                        StorageReference objRef = storageRef.child("obj_files").child(user.getUid()).child(fileName);

                        try {
                            StorageMetadata metadata = new StorageMetadata.Builder()
                                    .setContentType("application/x-tgif")
                                    .build();

                            objRef.putBytes(tgifResponseBytes, metadata)
                                    .addOnSuccessListener(taskSnapshot -> {
//                                        Intent intent = new Intent(Model.blend.CreateFaceMeshActivity.this, ProfileActivity.class);
//                                        intent.putExtra("jobName", jobName);
//                                        startActivity(intent);
                                        objRef.getDownloadUrl()
                                                .addOnSuccessListener(uri -> {
                                                    String downloadUrl = uri.toString();
                                                    // You can use the downloadUrl if needed
                                                    ShowSuccess(jobName);
                                                })
                                                .addOnFailureListener(e -> {
                                                    // Handle failure to get download URL
                                                });
                                    })
                                    .addOnFailureListener(e -> {
//                                        Toast.makeText(Model.blend.CreateFaceMeshActivity.this, "Failed to save  file", Toast.LENGTH_SHORT).show();
                                    });
                        } catch (IllegalArgumentException e) {
                            e.printStackTrace();
//                            Toast.makeText(Model.blend.CreateFaceMeshActivity.this, "Connection Error. Please try again later.", Toast.LENGTH_SHORT).show();
                        }
                    }
                });
            }
            private void ShowSuccess(String jobName) {
                View parentLayout = findViewById(android.R.id.content);
                Snackbar snackbar = Snackbar.make(parentLayout, jobName + " successfully Generated", Snackbar.LENGTH_LONG);

                snackbar.setAction("Close", v -> snackbar.dismiss());

                snackbar.show();
            }
            //func to move ComputationInProgress

            private String getRealPathFromUri(Uri uri) {
                String[] projection = {MediaStore.Images.Media.DATA};
                Cursor cursor = getContentResolver().query(uri, projection, null, null, null);

                if (cursor != null && cursor.moveToFirst()) {
                    int columnIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                    String filePath = cursor.getString(columnIndex);
                    cursor.close();
                    return filePath;
                }

                return uri.getPath();
            }
        }


    }
    @Test
    public void ResponseFromFlask() {
    }
    @Test
    public void DataSaved() {
    }
    @Test
    public void signinWithGoogle() {
    }
    @Test
    public void downloadData() {
    }



}