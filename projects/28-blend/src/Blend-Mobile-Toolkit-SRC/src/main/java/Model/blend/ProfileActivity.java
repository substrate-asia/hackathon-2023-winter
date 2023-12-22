package Model.blend;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;


import com.example.blend.R;
import com.firebase.ui.auth.AuthUI;
import com.google.android.material.snackbar.Snackbar;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.storage.FirebaseStorage;
import com.google.firebase.storage.StorageReference;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ProfileActivity extends AppCompatActivity implements FaceMeshAdapter.FaceMeshClickListener {

    private TextView nicknameTextView;
    private TextView faceMeshCounterTextView;
    private FaceMeshAdapter faceMeshAdapter;
    private List<FaceMeshData> facemeshDataList;
    private FirebaseAuth mAuth;
    private FirebaseFirestore db;
    private StorageReference storageRef;
    private ProgressBar loadingProgressBar;
    private ListView facemeshListView;
    private ImageView emptyListImageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.profile);
        storageRef = FirebaseStorage.getInstance().getReference();

        Intent intent = getIntent();
        if (intent.hasExtra("jobName")) {
            String jobName = intent.getStringExtra("jobName");
            ShowSuccess(jobName);
            showNotification(jobName);


        }

//imports from layout
        facemeshListView = findViewById(R.id.facemeshListView);
        loadingProgressBar = findViewById(R.id.loadingProgressBar);
        emptyListImageView = findViewById(R.id.emptyListImageView);

        facemeshDataList = new ArrayList<>();
        mAuth = FirebaseAuth.getInstance();
        db = FirebaseFirestore.getInstance();

        // face mesh adapter imports for list view
        faceMeshAdapter = new FaceMeshAdapter(this, facemeshDataList);
        faceMeshAdapter.setClickListener(this);
        facemeshListView.setAdapter(faceMeshAdapter);

        nicknameTextView = findViewById(R.id.nicknameTextView);
        faceMeshCounterTextView = findViewById(R.id.faceMeshCounterTextView);

        ImageButton ActionButton = findViewById(R.id.btnAction);
        Button signOutButton = findViewById(R.id.btnlogout);

        signOutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                signOut();
            }
        });

        ActionButton.setOnClickListener(view -> {
            Intent intent2 = new Intent(ProfileActivity.this, CreateFaceMeshActivity.class);
            startActivity(intent2);
            finish();
        });

        // Load user data and face mesh data
        loadUserData();
        loadFaceMeshData();

    }

    @Override
    public void onItemClick(FaceMeshData faceMeshData) {
        // Start the PreviewActivity
        Intent intent = new Intent(ProfileActivity.this, PreviewActivity.class);
        intent.putExtra("faceMeshUrl", faceMeshData.getUrl());
        intent.putExtra("jobName", faceMeshData.getJobName());
        startActivity(intent);

    }

    //Function to load user profile data
    private void loadUserData() {
        FirebaseUser user = mAuth.getCurrentUser();
        if (user != null) {
            db.collection("users")
                    .document(user.getUid())
                    .get()
                    .addOnCompleteListener(task -> {
                        if (task.isSuccessful()) {
                            DocumentSnapshot document = task.getResult();
                            if (document != null && document.exists()) {
                                User userData = document.toObject(User.class);
                                if (userData != null) {
                                    nicknameTextView.setText(userData.getNickname());
                                }
                            }
                        }
                    });
        }
    }

    //Function to load facemesh data
private void loadFaceMeshData() {
    FirebaseUser user = mAuth.getCurrentUser();
    if (user != null) {
        StorageReference userFolderRef = storageRef.child("obj_files").child(user.getUid());

        // Show the loading indicator
        loadingProgressBar.setVisibility(View.VISIBLE);
        facemeshListView.setVisibility(View.GONE);

        userFolderRef.listAll()
                .addOnSuccessListener(listResult -> {
                    facemeshDataList.clear();
                    for (StorageReference item : listResult.getItems()) {
                        // Fetch metadata directly from StorageReference
                        item.getMetadata().addOnSuccessListener(storageMetadata -> {
                            Date creationDate = new Date(storageMetadata.getCreationTimeMillis());
                            item.getDownloadUrl().addOnSuccessListener(uri -> {
                                facemeshDataList.add(new FaceMeshData(item.getName(), uri.toString(), creationDate));
                                faceMeshAdapter.notifyDataSetChanged();
                                faceMeshCounterTextView.setText(String.valueOf(facemeshDataList.size()));
                            }).addOnFailureListener(exception -> {
                                Toast.makeText(ProfileActivity.this, "Failed to retrieve face mesh data", Toast.LENGTH_SHORT).show();
                            });
                        }).addOnFailureListener(exception -> {
                            Toast.makeText(ProfileActivity.this, "Failed to retrieve metadata", Toast.LENGTH_SHORT).show();
                        });
                    }

                    // Hide the loading indicator and show the ListView
                    new Handler().postDelayed(() -> {
                        loadingProgressBar.setVisibility(View.GONE);
                        if (facemeshDataList.isEmpty()) {
                            facemeshListView.setVisibility(View.GONE);
                            emptyListImageView.setVisibility(View.VISIBLE);
                        } else {
                            facemeshListView.setVisibility(View.VISIBLE);
                            emptyListImageView.setVisibility(View.GONE);
                        }
                    }, 6000);

                })
                .addOnFailureListener(exception -> {
                    Toast.makeText(ProfileActivity.this, "Failed to retrieve face mesh data", Toast.LENGTH_SHORT).show();
                    loadingProgressBar.setVisibility(View.GONE);
                });
    }
}

    private void ShowSuccess(String jobName) {
        View parentLayout = findViewById(android.R.id.content);
        Snackbar snackbar = Snackbar.make(parentLayout, jobName + " successfully Generated", Snackbar.LENGTH_LONG);

        snackbar.setAction("Close", v -> {
            snackbar.dismiss();

            reloadPage();
        });

        snackbar.show();
        showNotification(jobName);
    }

    private void reloadPage() {
        Intent intent = getIntent();
        finish();
        startActivity(intent);
    }

    // Function to show notifications
    private void showNotification(String jobName) {
        // Create an intent to launch the ProfileActivity when the notification is clicked
        Intent intent = new Intent(this, ProfileActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_IMMUTABLE);

        // Build the notification
        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, "BlendChannel")
                .setSmallIcon(R.drawable.blend2)
                .setContentTitle("FaceMesh Created Successfully")
                .setContentText(jobName + " has been generated successfully")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true);
        // Show the notification
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {

            return;
        }
        notificationManager.notify(1, builder.build());
    }



    private void signOut() {
        AuthUI.getInstance().signOut(this).addOnCompleteListener(task -> {
            if (task.isSuccessful()) {

                startActivity(new Intent(this, SignInSignUpActivity.class));
                finish();
            } else {

                Toast.makeText(this, "Sign out failed", Toast.LENGTH_SHORT).show();
            }
        });
    }

}
