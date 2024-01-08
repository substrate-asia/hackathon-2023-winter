package Model.blend;

import static androidx.constraintlayout.helper.widget.MotionEffect.TAG;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.ParcelFileDescriptor;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;


import com.example.blend.R;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class PreviewActivity extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private FirebaseFirestore db;
    private ProgressBar progressBar;
    private StorageReference storageRef;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_preview);
        mAuth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();
        storageRef = FirebaseStorage.getInstance().getReference();
        progressBar = findViewById(R.id.loadingProgressBar);

        Button btnBackToProfile = findViewById(R.id.btnBack);

        btnBackToProfile.setOnClickListener(view -> {
            Intent intent = new Intent(PreviewActivity.this, ProfileActivity.class);
            startActivity(intent);
            finish();
        });


        // Get the faceMeshUrl and jobName from the intent
        String faceMeshUrl = getIntent().getStringExtra("faceMeshUrl");

        String jobName = getIntent().getStringExtra("jobName");
        // Fetch and display the creation date for the job
        fetchCreationDate(jobName);

        TextView jobNameTextView = findViewById(R.id.jobname);
        jobNameTextView.setText(jobName);

        ImageButton viewButton = findViewById(R.id.viewButton);
        viewButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openViewerActivity(jobName);
            }
        });


        Button downloadButton = findViewById(R.id.downloadButton);
        downloadButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (jobName != null) {
                    openFilePicker();
                } else {
                    Toast.makeText(PreviewActivity.this, "Job name is null", Toast.LENGTH_SHORT).show();
                }
            }
        });
    }


    private final ActivityResultLauncher<Intent> filePickerLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == Activity.RESULT_OK) {
                    Intent data = result.getData();
                    if (data != null) {
                        Uri uri = data.getData();
                        String jobName = getIntent().getStringExtra("jobName");
                        downloadFaceMesh(jobName, uri);
                    }
                }
            }
    );

    //func to download facemesh
    private void downloadFaceMesh(String jobName, Uri downloadUri) {
        progressBar.setVisibility(View.VISIBLE);
        FirebaseUser user = mAuth.getCurrentUser();

        StorageReference objRef = storageRef.child("obj_files").child(user.getUid()).child(jobName);
        Log.w(TAG, "downloadFaceMesh: " + objRef);
        objRef.getDownloadUrl().addOnSuccessListener(uri -> {
            // Use OkHttpClient for the download request
            OkHttpClient client = new OkHttpClient();

            // Build the request with the HTTPS URL
            Request request = new Request.Builder()
                    .url(uri.toString())
                    .build();

            // Enqueue the request for asynchronous execution
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                    // Handle download failure
                    runOnUiThread(() -> {

                        progressBar.setVisibility(View.GONE);
                        Toast.makeText(PreviewActivity.this, "Failed to download file", Toast.LENGTH_SHORT).show();
                    });
                }

                @Override
                public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                    // Handle the download response
                    if (response.isSuccessful()) {
                        try {
                            // Get the selected document's file descriptor

                            ParcelFileDescriptor pfd = getContentResolver().openFileDescriptor(downloadUri, "w");

                            // Write the response bytes to the selected file
                            if (pfd != null) {
                                try (FileOutputStream fos = new FileOutputStream(pfd.getFileDescriptor())) {
                                    fos.write(response.body().bytes());

                                    // File downloaded successfully
                                    runOnUiThread(() -> {
                                        Toast.makeText(PreviewActivity.this, "File downloaded successfully", Toast.LENGTH_SHORT).show();
                                        progressBar.setVisibility(View.GONE);
                                    });
                                }
                            }
                        } catch (IOException e) {
                            e.printStackTrace();
                            // Handle IOException during file writing
                            runOnUiThread(() -> {
                                Toast.makeText(PreviewActivity.this, "Error writing file", Toast.LENGTH_SHORT).show();
                                progressBar.setVisibility(View.GONE);
                            });
                        }


                    } else {
                        // Handle unsuccessful response
                        runOnUiThread(() -> {

                            progressBar.setVisibility(View.GONE);
                            Toast.makeText(PreviewActivity.this, "Failed to download file", Toast.LENGTH_SHORT).show();

                        });
                    }
                }
            });
        });
    }

    //func to open image picker
    private void openFilePicker() {
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("*/*");
        String jobName = getIntent().getStringExtra("jobName");
        intent.putExtra(Intent.EXTRA_TITLE, jobName + ".obj");
        filePickerLauncher.launch(intent);
    }

    //function to fetch the date
    private void fetchCreationDate(String jobName) {
        FirebaseUser user = mAuth.getCurrentUser();
        if (user != null) {
            StorageReference objRef = storageRef.child("obj_files").child(user.getUid()).child(jobName);

            objRef.getMetadata().addOnSuccessListener(storageMetadata -> {
                // Get the creation date from metadata
                Date creationDate = new Date(storageMetadata.getCreationTimeMillis());

                // Display the creation date under the job name
                TextView creationDateTextView = findViewById(R.id.creationDateTextView2);
                SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss", Locale.getDefault());
                String formattedDate = sdf.format(creationDate);
                creationDateTextView.setText(formattedDate);
            }).addOnFailureListener(exception -> {
                Toast.makeText(PreviewActivity.this, "Failed to retrieve creation date", Toast.LENGTH_SHORT).show();
            });
        }
    }


// function to move to viewer activity
    private void openViewerActivity(String jobName) {
        Intent intent = new Intent(PreviewActivity.this, ViewerActivity.class);
        intent.putExtra("jobName", jobName);
        startActivity(intent);
    }
}
