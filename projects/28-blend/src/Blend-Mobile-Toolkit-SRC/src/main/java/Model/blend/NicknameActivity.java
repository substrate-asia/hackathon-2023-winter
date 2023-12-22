package Model.blend;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;


import com.example.blend.R;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;

public class NicknameActivity extends AppCompatActivity {
    private final FirebaseFirestore db = FirebaseFirestore.getInstance();
    private final FirebaseAuth mAuth = FirebaseAuth.getInstance();
    private EditText nicknameEditText;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_nickname);
// imports
        ImageView imageView = findViewById(R.id.imageView2);
        TextView textView = findViewById(R.id.textView);
        Button nextButton = findViewById(R.id.next);
        nicknameEditText = findViewById(R.id.nickname_Activity);
        nextButton.setOnClickListener(v -> onNextButtonClick());
    }

    // function to move to next activity
    private void onNextButtonClick() {
        FirebaseUser user = mAuth.getCurrentUser();

        if (user != null) {
            String nickname = nicknameEditText.getText().toString();
            String uid = user.getUid();
            if (!nickname.isEmpty()) {
                User userData = new User(uid,  nickname);
                DocumentReference userRef = db.collection("users").document(uid);
                userRef.set(userData).addOnCompleteListener(task -> {
                    if (task.isSuccessful()) {
                        showToast("Nickname stored successfully");
                        startActivity(new Intent(NicknameActivity.this, ProfileActivity.class));
                        finish();
                    } else {
                        showToast("Failed to store nickname");
                    }
                });
            } else {
                showToast("Please provide a nickname");
            }
        } else {
            showToast("User is not signed in");
        }
    }

    private void showToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show();
    }
}