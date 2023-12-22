package Model.blend;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Check if the user is signed in
        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();
        if (currentUser != null) {
            // User is signed in, open ProfileActivity
            startActivity(new Intent(MainActivity.this, ProfileActivity.class));
        } else {
            // User is not signed in, open SignInSignUpActivity
            startActivity(new Intent(MainActivity.this, SignInSignUpActivity.class));
        }

        // Finish the current activity
        finish();
    }
}
